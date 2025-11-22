import { Schema, model } from "mongoose";

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    parent_location_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
    description: { type: String },
  },
  { timestamps: true }
);

export default model("Location", LocationSchema);
