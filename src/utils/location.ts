import * as Location from "expo-location";
import { positionService } from "../api/position";
import { LOCATION_TASK_NAME } from "../constants/tasks";

export async function trackLocationForeground() {
  console.log("[starting foreground positions]");
  const LocationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.LocationAccuracy.BestForNavigation,
      timeInterval: 10000,
      distanceInterval: 50,
      mayShowUserSettingsDialog: true,
    },
    async ({ coords, timestamp }) => {
      console.log(
        "[foreground-pos]:",
        new Date(timestamp).toLocaleTimeString(),
        coords.latitude,
        coords.longitude,
        coords.accuracy?.toFixed(2)
      );
      try {
        const saved = await positionService.savePosition({
          device_id: "device_123",
          lat: String(coords.latitude),
          lon: String(coords.longitude),
          direction: String(coords.heading),
          mem: false,
          speed: String(coords.speed),
          date: String(timestamp),
          type: "foreground",
        });
        if (saved) {
          console.log("[foreground-save]: ", saved.data);
        }
      } catch (error) {
        console.log("[foreground-save-error]", error);
      }
    }
  );

  return LocationSubscription;
}

export async function startLocationBackground() {
  console.log("[starting location background]");
  const isBackgroundLocationAvailableAsync =
    await Location.isBackgroundLocationAvailableAsync();
  if (!isBackgroundLocationAvailableAsync) {
    console.log("background location not available");
    return;
  }
  Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    activityType: Location.ActivityType.AutomotiveNavigation,
    deferredUpdatesDistance: 50,
    deferredUpdatesInterval: 10000,
    distanceInterval: 50,
    foregroundService: {
      notificationBody: "teste",
      notificationTitle: "teste title",
      killServiceOnDestroy: false,
      notificationColor: "7F00FF",
    },
    mayShowUserSettingsDialog: true,
    pausesUpdatesAutomatically: true,
    showsBackgroundLocationIndicator: true,
    timeInterval: 10000,
  });
}

export async function stopLocationBackground() {
  console.log("[stopping location background]");
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  console.log("hasStartedLocationUpdatesAsync", hasStarted);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}
