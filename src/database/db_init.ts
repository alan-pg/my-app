import { WebSQLDatabase } from "expo-sqlite";
import { sqlite_db_file_name } from "../constants/database";
import { getConnection } from "./db_con";
import { createTables } from "./sql";

export class DatabaseInit {
  private bd: WebSQLDatabase;

  constructor() {
    this.bd = getConnection(sqlite_db_file_name);
    this.initDb();
  }

  private initDb() {
    createTables.forEach((t) => {
      this.bd.transaction((tx) => {
        tx.executeSql(t);
      });
    });
  }
}
