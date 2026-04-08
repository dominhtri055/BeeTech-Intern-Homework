import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    whatsappId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);