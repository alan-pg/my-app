import { useCallback, useEffect, useRef } from "react";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useAppState } from "./src/hooks/useAppState";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MapScreen } from "./src/screens/map";
import { HistoryScreen } from "./src/screens/history";

import { LocationObject } from "expo-location";
import { SettingsScreen } from "./src/screens/settings";
import { Position } from "./src/models/Position";
import { initDatabase } from "./src/database/db_con";
import { PositionService } from "./src/services/PositionService";

initDatabase();
const positionService = new PositionService();

async function handleLocation(
  location: LocationObject,
  type: "foreground" | "background"
) {
  const position = new Position({
    deviceId: "device_123",
    isMem: false,
    type,
    location,
  });
  /* console.log("position", type, position); */

  const resp = await positionService.savePosition(position);
  console.log("position save", resp);
}

const LOCATION_TRACKING = "location-tracking";

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    handleLocation(locations[0], "background");
  }
});

export default function App() {
  const { appState } = useAppState();
  const locationSubscription = useRef<Location.LocationSubscription>();

  const startBgLocation = useCallback(async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5 * 60000,
      distanceInterval: 0,
      mayShowUserSettingsDialog: true,
      showsBackgroundLocationIndicator: true,
      activityType: Location.ActivityType.AutomotiveNavigation,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log("tracking started?", hasStarted);
  }, []);

  useEffect(() => {
    (async () => {
      positionService.syncMemPosition();
      const { granted: fgGranted } =
        await Location.requestForegroundPermissionsAsync();
      await Location.enableNetworkProviderAsync();

      if (fgGranted) {
        await Location.requestBackgroundPermissionsAsync();
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 0,
            mayShowUserSettingsDialog: true,
          },
          (location) => {
            handleLocation(location, "foreground");
          }
        );
      }
    })();

    return () => {
      console.log("locationSubscription remove");
      locationSubscription.current?.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (appState === "active") {
        const hasStartedLocationUpdatesAsync =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
        console.log(
          "hasStartedLocationUpdatesAsync",
          hasStartedLocationUpdatesAsync
        );
        if (hasStartedLocationUpdatesAsync) {
          await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }
      } else if (appState === "background") {
        await startBgLocation();
      }
    })();
  }, [appState]);

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen key={0} name="Mapa" component={MapScreen} />
        <Tab.Screen key={1} name="Histórico" component={HistoryScreen} />
        <Tab.Screen key={2} name="Configurar" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
