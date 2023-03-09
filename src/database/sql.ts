export const MEM_POSITIONS_TABLE_NAME = "mem_positions";

const sql_create_mem_positions_table =
  `CREATE TABLE IF NOT EXISTS ${MEM_POSITIONS_TABLE_NAME} ` +
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

export const createTables = [sql_create_mem_positions_table];
export const INSERT_INTO_MEM_POSITIONS =
  `INSERT INTO ${MEM_POSITIONS_TABLE_NAME} ` +
  "(device_id, lat, lon, speed, direction, type, mem, date, accuracy) " +
  "values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
