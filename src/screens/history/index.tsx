import React, { useCallback, useState } from "react";

import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Map } from "../../components/map";
import { MapPolylineProps } from "react-native-maps";
import { PositionService } from "../../services/PositionService";

const positionService = new PositionService();

export function HistoryScreen() {
  const [positionsPolyline, setPositionsPolyline] = useState<
    MapPolylineProps[]
  >([]);
  const [showDay, setShowDay] = useState(false);
  const [showInitialTime, setShowInitialTime] = useState(false);
  const [showFinalTime, setShowFinalTime] = useState(false);

  const [day, setDay] = useState<Date>(new Date());
  const [initial, setInitial] = useState<Date>();
  const [final, setFinal] = useState<Date>();
  console.log("show", { showDay, showInitialTime, showFinalTime });

  const handleGetPositions = useCallback(async () => {
    const _day = day?.toISOString().split("T")[0];
    const _initial = initial?.toISOString().split("T")[1].split(".")[0];
    const _final = final?.toISOString().split("T")[1].split(".")[0];

    const initial_date = _day + "T" + _initial;
    const final_date = _day + "T" + _final;
    console.log("handleGetPositions pt-BR", { initial_date, final_date });

    const resp = await positionService.getPositions({
      deviceId: "device_123",
      initial_date,
      final_date,
    });
    if (resp.data.payload) {
      console.log("payload", resp.data.payload.length);
      const coords = resp.data.payload.map((pos) => ({
        latitude: Number(pos.lat),
        longitude: Number(pos.lon),
      }));

      setPositionsPolyline([
        {
          coordinates: coords,
          strokeColor: "#000",
          strokeColors: [
            "#7F0000",
            "#00000000",
            "#B24112",
            "#E5845C",
            "#238C23",
            "#7F0000",
          ],
          strokeWidth: 6,
        },
      ]);
    }
  }, [day, initial, final]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styleSheet.MainContainer}>
        <View style={styleSheet.datePickerSection}>
          <Button title="Dia" color="blue" onPress={() => setShowDay(true)} />
          <Button
            title="Início"
            color="blue"
            onPress={() => setShowInitialTime(true)}
          />
          <Button
            title="Fim"
            color="blue"
            onPress={() => setShowFinalTime(true)}
          />
          <Button title="Buscar" color="blue" onPress={handleGetPositions} />
        </View>
        <Text>
          {day?.toISOString().split("T")[0]}{" "}
          {initial?.toISOString().split("T")[1].split(".")[0]} |{" "}
          {final?.toISOString().split("T")[1].split(".")[0]}
        </Text>
        {showDay && (
          <DateTimePicker
            collapsable={true}
            value={day}
            mode={"date"}
            display={"default"}
            is24Hour={true}
            onChange={(e, d) => {
              setShowDay(false);
              if (d) {
                const br_date = new Date(d);
                br_date.setHours(br_date.getHours() - 3);
                br_date.setSeconds(0);
                setDay(br_date);
                setShowInitialTime(true);
              }
            }}
            onTouchCancel={() => setShowDay(false)}
            style={styleSheet.datePicker}
          />
        )}
        {showInitialTime && (
          <DateTimePicker
            value={initial || new Date()}
            mode={"time"}
            display={"default"}
            is24Hour={true}
            locale="pt-BR"
            onChange={(e, d) => {
              console.log("onChange initial", d);
              setShowInitialTime(false);
              if (d) {
                const br_date = new Date(d);
                br_date.setHours(br_date.getHours() - 3);
                br_date.setSeconds(0);
                setInitial(br_date);
                setShowFinalTime(true);
              }
            }}
            onTouchCancel={() => setShowInitialTime(false)}
            style={styleSheet.datePicker}
          />
        )}

        {showFinalTime && (
          <DateTimePicker
            value={final || new Date()}
            mode={"time"}
            display={"default"}
            is24Hour={true}
            locale="pt-BR"
            onChange={(e, d) => {
              setShowFinalTime(false);
              if (d) {
                const br_date = new Date(d);
                br_date.setHours(br_date.getHours() - 3);
                br_date.setSeconds(0);
                setFinal(br_date);
              }
            }}
            onTouchCancel={() => setShowFinalTime(false)}
            style={styleSheet.datePicker}
          />
        )}

        <Map
          showsUserLocation={false}
          followsUserLocation={false}
          polylines={positionsPolyline}
        />
      </View>
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  datePickerSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 40,
    border: "3px solid red",
  },
  text: {
    fontSize: 25,
    color: "red",
    padding: 3,
    marginBottom: 10,
    textAlign: "center",
  },

  // Style for iOS ONLY...
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 260,
    display: "flex",
  },
});
