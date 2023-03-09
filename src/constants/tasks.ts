import * as Location from "expo-location";
import { LocationOptions, LocationTaskOptions } from "expo-location";

export const LOCATION_TASK_NAME = "background-location-task";

export const LOCATION_FG_OPTIONS: LocationOptions = {
  accuracy: Location.LocationAccuracy.BestForNavigation,
  timeInterval: 10000,
  distanceInterval: 50,
  mayShowUserSettingsDialog: true,
};

export const BG_LOCATION_OPTIONS: LocationTaskOptions = {
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
};
