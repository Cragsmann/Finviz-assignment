import mongoose, { Schema, Document } from "mongoose";

export interface IParsedData extends Document {
  name: string;
  size: number;
  wnid?: string;
  gloss?: string;
}

const ParsedDataSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    wnid: { type: String },
    gloss: { type: String },
  },
  { versionKey: false, collection: "parsedData" }
);

ParsedDataSchema.index({ wnid: 1 });
ParsedDataSchema.index({ name: 1 });

export const ParsedDataModel = mongoose.model<IParsedData>(
  "ParsedData",
  ParsedDataSchema
);
