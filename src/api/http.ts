import axios, { AxiosResponse } from "axios";
import { PositionHistory } from "../dtos/positionDTO";
import { Position } from "../models/Position";

export const api = axios.create({
  baseURL: "https://apg-device-gps-tracker.onrender.com",
});

export const positionApi = {
  savePosition: (position: Position) => api.post("/position", position),
  getPositions: (
    device_id: string,
    inital_date: string,
    final_date: string
  ): Promise<AxiosResponse<{ message: string; payload: PositionHistory[] }>> =>
    api.get("/position", {
      params: {
        device_id,
        inital_date,
        final_date,
      },
    }),
};
