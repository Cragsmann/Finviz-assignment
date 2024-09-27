import sqlite3, { Database } from "sqlite3";
import { DB_PATH } from "../config/config";

export function getDbConnection(): Database {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  return db;
}
