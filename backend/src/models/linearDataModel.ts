import mongoose from "mongoose";

const LinearDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
});

export const LinearData = mongoose.model("LinearData", LinearDataSchema);
