import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Inventory Managers", "Warehouse Staff"], required: true },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
