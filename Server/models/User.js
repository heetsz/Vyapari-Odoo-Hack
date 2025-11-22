import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
<<<<<<< Updated upstream
    name: { type: String },
=======
    name: { type: String},
>>>>>>> Stashed changes

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // MERGED: Keeping all roles from both versions
    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff", "Inventory Manager"],
      required: true,
      default: "Staff"
    },

    // Email verification fields (kept from second version)
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
