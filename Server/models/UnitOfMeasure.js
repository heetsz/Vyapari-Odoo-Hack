import { Schema, model } from "mongoose";

const UnitOfMeasureSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // kg, pcs, box, liter, etc.
    abbreviation: { type: String, required: true }, // kg, pcs, box, L, etc.
    description: { type: String },
  },
  { timestamps: true }
);

export default model("UnitOfMeasure", UnitOfMeasureSchema);
