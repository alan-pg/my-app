import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { openLocationSettings } from "../../utils/permisions";

export function SettingsScreen() {
  const [fgGranted, setFgGranted] = useState(false);
  const [bgGranted, setBgGranted] = useState(false);
  const [bgAsked, setBgAsked] = useState(false);
  const [bgAskedGranted, setBgAskedGranted] = useState(false);
  const [pkgValue, setPkgValue] = useState("");

  useEffect(() => {
    const checkPermission = async () => {
      const fgPermission = await Location.getForegroundPermissionsAsync();
      setFgGranted(fgPermission.granted);
      const bgPermission = await Location.getBackgroundPermissionsAsync();
      setBgGranted(bgPermission.granted);
    };
    checkPermission();
  }, []);

  const requestForeground = async () => {
    await Location.requestForegroundPermissionsAsync();
  };
  const requestBackground = async () => {
    const { granted } = await Location.requestBackgroundPermissionsAsync();
    setBgAskedGranted(granted);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styleSheet.MainContainer}>
        <Text>foreground: {fgGranted ? "yes" : "no"}</Text>
        <Text>background: {bgGranted ? "yes" : "no"}</Text>
        <Text>background asked: {bgAsked ? "yes" : "no"}</Text>
        <Text>background AskedGranted: {bgAskedGranted ? "yes" : "no"}</Text>
        <Text>pkg name: {pkgValue}</Text>
        <Button
          title="open settings"
          color="red"
          onPress={() => {
            openLocationSettings();
          }}
        />
        {!fgGranted && (
          <Button
            title="Permitir boreground"
            color="blue"
            onPress={requestForeground}
          />
        )}
        {!bgGranted && (
          <Button
            title="Permitir background"
            color="blue"
            onPress={requestBackground}
          />
        )}
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
