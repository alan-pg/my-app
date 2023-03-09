import { LocationObject } from "expo-location";

export interface IPosition {
  id?: number;
  device_id: string;
  lat: number;
  lon: number;
  speed: number | null;
  direction: number | null;
  type: string;
  mem: boolean;
  date: string;
  accuracy: number | null;
}

export interface ICreatePosition {
  deviceId: string;
  isMem: boolean;
  type: "foreground" | "background";
  location: LocationObject;
}

export interface PositionHistory extends IPosition {
  id: number;
  created_at: Date;
}
