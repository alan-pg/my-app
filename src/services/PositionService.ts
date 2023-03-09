import { WebSQLDatabase } from "expo-sqlite";
import { positionApi } from "../api/http";
import { sqlite_db_file_name } from "../constants/database";
import { getConnection } from "../database/db_con";
import {
  INSERT_INTO_MEM_POSITIONS,
  MEM_POSITIONS_TABLE_NAME,
} from "../database/sql";
import { Position } from "../models/Position";

export class PositionService {
  private db: WebSQLDatabase;

  constructor() {
    this.db = getConnection(sqlite_db_file_name);
  }

  async saveMemPosition(position: Position) {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            INSERT_INTO_MEM_POSITIONS,
            [
              position.deviceId,
              position.lat,
              position.lon,
              position.speed,
              position.direction,
              position.type,
              position.mem ? 1 : 0,
              position.date,
              position.accuracy,
            ],
            (txObj, resultSet) => {
              console.log("sqlite success");
              return resolve(resultSet.insertId);
            },
            (txObj, err) => {
              console.log("[sqlite error]: ", err.message);
              return true;
            }
          );
        },
        (err) => {
          return reject(err.message);
        }
      );
    });
  }

  async getMemPositions({
    limit = 20,
  }: {
    limit: number;
  }): Promise<Position[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `select * from ${MEM_POSITIONS_TABLE_NAME} ORDER BY date LIMIT ${limit}`,
            [],
            (txObj, resultSet) => {
              return resolve(resultSet.rows._array);
            },
            (txObj, error) => {
              console.log("select memPositions error: ", error.message);
              return true;
            }
          );
        },
        (error) => {
          return reject(error);
        }
      );
    });
  }

  async deleteMemPositions(id: number) {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `DELETE FROM ${MEM_POSITIONS_TABLE_NAME} WHERE id = ? `,
            [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                return resolve(resultSet.rowsAffected);
              }
              console.log("delete memPositions error: ");
              return reject("cant delete mem position");
            },
            (txObj, error) => {
              console.log("delete memPositions error: ", error.message);
              return true;
            }
          );
        },
        (error) => {
          return reject(error);
        }
      );
    });
  }

  async syncMemPosition() {
    let total = 0;
    do {
      const positions = await this.getMemPositions({ limit: 20 });
      total = positions.length;
      console.log("mem total", total);
      try {
        await Promise.all(
          positions.map(async (p) => {
            await this.savePosition(p);
            await this.deleteMemPositions(p.id as number);
            console.log("deleted position mem", p.id);
          })
        );
      } catch (error) {
        console.log("sync mem position error", error);
      }
    } while (total > 0);
  }

  async savePosition(position: Position) {
    try {
      const resp = await positionApi.savePosition(position);
      return resp.data;
    } catch (error) {
      console.log("save position error, seving mem");
      position.mem = true;
      return this.saveMemPosition(position);
    }
  }

  async getPositions(props: {
    deviceId: string;
    initial_date: string;
    final_date: string;
  }) {
    const { deviceId, initial_date, final_date } = props;
    return positionApi.getPositions(deviceId, initial_date, final_date);
  }
}
