import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { 
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    pass: { type: String },
    deleted: { type: Boolean, default: false },
    signature: { type: String },

    // 🔥 New fields for password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
  },
  { timestamps: true }
);


const user = mongoose.model("user", UserSchema);
export default user;
