import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

interface AppStateContextProps {
  appState: AppStateStatus;
}

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateContext = createContext({} as AppStateContextProps);

const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    /* console.log("App State: " + nextAppState); */
    if (appState != nextAppState) {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        /*   console.log("App State: " + "App has come to the foreground!"); */
        alert("App State: " + "App has come to the foreground!");
      }
      alert("App State: " + nextAppState);
      setAppState(nextAppState);
    }
  };

  useEffect(() => {
    console.log("creating subscription");
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      console.log("remove subscription appState");
      subscription.remove();
    };
  }, []);

  return (
    <AppStateContext.Provider value={{ appState }}>
      {children}
    </AppStateContext.Provider>
  );
};

function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}

export { useAppState, AppStateProvider };
