import mongoose from "mongoose";
import { mongoDB_URL } from "../config/config";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoDB_URL);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
