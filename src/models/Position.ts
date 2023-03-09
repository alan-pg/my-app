import { ICreatePosition, IPosition } from "../dtos/positionDTO";

export class Position {
  private position: IPosition;

  constructor(props: ICreatePosition) {
    const { deviceId, isMem, type, location } = props;

    this.position = {
      device_id: deviceId,
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      direction: location.coords.heading,
      speed: location.coords.speed,
      accuracy: location.coords.accuracy,
      date: String(new Date(location.timestamp).toISOString()),
      mem: isMem,
      type,
    };
  }

  public get id() {
    return this.position.id;
  }

  public get deviceId() {
    return this.position.device_id;
  }

  public get lat() {
    return this.position.lat;
  }

  public get lon() {
    return this.position.lon;
  }

  public get direction() {
    return this.position.direction;
  }

  public get speed() {
    return this.position.speed;
  }

  public get accuracy() {
    return this.position.accuracy;
  }

  public get date() {
    return this.position.date;
  }

  public get type() {
    return this.position.type;
  }

  public get mem() {
    return this.position.mem;
  }

  public set mem(value: boolean) {
    this.mem = value;
  }
}
