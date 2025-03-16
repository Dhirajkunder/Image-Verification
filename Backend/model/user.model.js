import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    pass: { type: String },
    deleted: { type: Boolean, default: false },
    signature:{type: String}
  },
  { timestamps: true }
);


const user = mongoose.model("user", UserSchema);
export default user;
