import * as Location from "expo-location";
import { useState } from "react";

export function useLocation() {
  const [coords, setCoords] = useState();
  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10,
      timeInterval: 30000,
    },
    ({ coords, timestamp }) => {
      console.log("watchPositionAsync", coords);
    }
  );

  return { coords };
}
