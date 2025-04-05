import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { 
      type: String,
      unique: true, // 🔥 ensure uniqueness
      required: true,
      lowercase: true, // 🔥 always store as lowercase
      trim: true, },
    pass: { type: String },
    deleted: { type: Boolean, default: false },
    signature:{type: String}
  },
  { timestamps: true }
);


const user = mongoose.model("user", UserSchema);
export default user;
