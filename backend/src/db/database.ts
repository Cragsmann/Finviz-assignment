import sqlite3, { Database } from "sqlite3";

export function getDbConnection(): Database {
  const db = new sqlite3.Database("src/db/ImageTree.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the ImageTreedData database.");
    }
  });
  return db;
}
