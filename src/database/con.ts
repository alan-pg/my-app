import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("gps_db.db");
console.log("connected db", db.version);
const sql_create_mem_positions_table =
  "CREATE TABLE IF NOT EXISTS mem_positions " +
  "(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "device_id INTEGER, " +
  "lat INTEGER, " +
  "Lon INTEGER, " +
  "speed INTEGER, " +
  "direction INTEGER, " +
  "type TEXT, " +
  "mem INTEGER, " +
  "date TEXT, " +
  "accuracy INTEGER)";

db.transaction((tx) => {
  tx.executeSql(sql_create_mem_positions_table);
});

export { db };
