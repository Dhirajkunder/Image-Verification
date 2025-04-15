import user from "../model/index.js";
import mongoose from "mongoose";
import { setuser } from "../helper/jwthandler.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";  // Added for JWT handling

const reg = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check if email already exists
    const isUserExist = await user.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // ✅ Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Create new user
    const newUser = await user.create({
      name,
      email,
      pass: hashedPassword,
    });

    const token = setuser({ isUserExist: newUser });

    return res.status(200).json({
      message: "User registered successfully",
      token,
      id: newUser._id,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAlluser = async (req, res) => {
  try {
    await user
      .find({ deleted: false })
      .then((re) => {
        if (re.length > 0) {
          return res.status(200).json({ data: re });
        } else {
          return res.status(200).json({ data: [] });
        }
      })
      .catch((err) => {
        return res.status(400).json({ data: "Failed to fetch the users" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check that email and password are strings
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input type" });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Ensure no injection in email field
    const safeEmail = validator.normalizeEmail(email);

    // 🔒 Use safe and validated email
    const isUserExist = await user.findOne({ email: safeEmail });

    if (!isUserExist) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    // 🔐 Password comparison
    const isMatch = await bcrypt.compare(password, isUserExist.pass);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // 🎉 Token setup
    const token = setuser({ isUserExist });

    return res.status(200).json({
      message: "Login successfully",
      token,
      userId: isUserExist._id,
      username: isUserExist.name,
      email: isUserExist.email,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletesingleuser = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);

      let isUserExist = await user.findById(objectId);
      if (isUserExist) {
        await user.findByIdAndDelete(objectId);
        return res.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;
    const signature = req.file?.filename; // safely get filename if file exists

    const updatedFields = { name, email };
    if (signature) {
      updatedFields.signature = signature;
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("🔥 Error in updateUser:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const forgetpass = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: `Reset link sent to ${email}` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { pass } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(pass, 10);

    await user.findByIdAndUpdate(decoded.id, { pass: hashedPassword });

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("Reset error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

const adminlogin = (req, res) => {
  const { name, password } = req.body;
  if (name === "admin" && password === "admin") {
    return res.status(200).json({
      message: "Login successfully",
    });
  } else {
    return res.status(200).json({
      message: "Invalid Username and password",
    });
  }
};

export {
  reg,
  login,
  getAlluser,
  deletesingleuser,
  forgetpass,
  resetpassword,
  adminlogin,
};
