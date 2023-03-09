import { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";
import { positionService } from "../api/position";
import { LOCATION_TASK_NAME } from "../constants/tasks";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: TaskManager.TaskManagerTaskBody<any>) => {
    if (error) {
      console.log("task error", error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: LocationObject[] };
      console.log(
        "[background-pos]:",
        new Date(locations[0].timestamp).toLocaleTimeString(),
        locations[0].coords.latitude,
        locations[0].coords.longitude,
        locations[0].coords.accuracy?.toFixed(2),
        locations.length,
        "appstatus"
      );

      try {
        const resp = await positionService.savePosition({
          device_id: "device_123",
          lat: String(locations[0].coords.latitude),
          lon: String(locations[0].coords.longitude),
          direction: String(locations[0].coords.heading),
          mem: false,
          speed: String(locations[0].coords.speed),
          date: String(new Date(locations[0].timestamp).toISOString()),
          type: "foreground",
        });
        console.log("[background-save]: ", resp.data);
      } catch (error) {
        console.log("[background-save-error]: ", error);
      }
      // do something with the locations captured in the background
    }
  }
);
