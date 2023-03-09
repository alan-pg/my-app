import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log("[app state]:", nextAppState);
    setAppState(nextAppState);
  };

  useEffect(() => {
    console.log("[creating subscription appState]");
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      console.log("[removing subscription appState]");
      subscription.remove();
    };
  }, []);

  return { appState };
}
