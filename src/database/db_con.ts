import * as SQLite from "expo-sqlite";
import { sqlite_db_file_name } from "../constants/database";
import { createTables } from "./sql";

export const getConnection = (sqlite_db_file_name: string) => {
  return SQLite.openDatabase(sqlite_db_file_name);
};

export const initDatabase = () => {
  const db = getConnection(sqlite_db_file_name);

  createTables.forEach((t) => {
    db.transaction((tx) => {
      tx.executeSql(t);
    });
  });
};
