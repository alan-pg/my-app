import { ActivityAction, startActivityAsync } from "expo-intent-launcher";
import * as Location from "expo-location";
import Constants from "expo-constants";

export async function requestForegroundPermissions() {
  let { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) {
    console.log("Permission to access location was denied");
    return false;
  }
  await Location.requestBackgroundPermissionsAsync();
  return true;
}

export async function requestBackgroundPermissions() {
  const { granted } = await Location.requestBackgroundPermissionsAsync();

  if (!granted) {
    console.log("Permission to access background location was denied");
    return false;
  }
  return true;
}

export async function openLocationSettings() {
  const pk = Constants.manifest?.android?.package || "host.exp.exponent";

  await startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS, {
    /*  data: "package:" + pk, */
  });
}
