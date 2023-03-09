import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import { useAppState } from "./src/hooks/useAppState";

const LOCATION_TRACKING = "location-tracking";

export default function App() {
  const { appState } = useAppState();
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log("tracking started?", hasStarted);
  };

  useEffect(() => {
    const config = async () => {
      let res = await Permissions.askAsync(Permissions.LOCATION);
      if (res.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };

    config();
  }, []);

  /*   useEffect(() => {
    if (appState === "background") {
      startLocationTracking();
    }
  }, [appState]); */

  return (
    <View style={styles.container}>
      <Button title="Start tracking" onPress={startLocationTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;

    console.log(`bg ${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
  }
});
