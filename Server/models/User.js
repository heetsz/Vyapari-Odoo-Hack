import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff", "Inventory Manager"],
      required: true,
      default: "Staff"
    },

    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
