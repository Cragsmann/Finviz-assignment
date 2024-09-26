// import mongoose from "mongoose";
// import { mongoDB_URL } from "../config/config";

// export const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(mongoDB_URL);
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// };

import sqlite3, { Database } from "sqlite3";

export function getDbConnection(): Database {
  const db = new sqlite3.Database("src/db/parsedData.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the parsedData database.");
    }
  });
  return db;
}
