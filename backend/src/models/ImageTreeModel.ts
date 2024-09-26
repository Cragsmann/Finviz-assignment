import mongoose, { Schema, Document } from "mongoose";

export interface IImageTree extends Document {
  name: string;
  size: number;
  wnid?: string;
  gloss?: string;
}

const ImageTreeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    wnid: { type: String },
    gloss: { type: String },
  },
  { versionKey: false, collection: "imageTree" }
);

ImageTreeSchema.index({ wnid: 1 });
ImageTreeSchema.index({ name: 1 });

export const ImageTreeModel = mongoose.model<IImageTree>(
  "ImageTree",
  ImageTreeSchema
);
