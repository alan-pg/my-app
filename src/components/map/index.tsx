import { StyleSheet } from "react-native";
import MapView, { MapPolylineProps, Polyline } from "react-native-maps";

interface MapProps {
  showsUserLocation: boolean;
  followsUserLocation: boolean;
  polylines?: MapPolylineProps[];
}

export function Map(props: MapProps) {
  const { followsUserLocation, showsUserLocation, polylines } = props;

  return (
    <MapView
      style={styles.map}
      showsUserLocation={showsUserLocation}
      userLocationPriority="high"
      followsUserLocation={followsUserLocation}
    >
      {polylines?.length
        ? polylines.map((p, i) => <Polyline key={i} {...p} />)
        : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
