import express from "express";
import multer from "multer";
import {
  reg,
  getAlluser,
  deletesingleuser,
  login,
  forgetpass,
  resetpassword,
  adminlogin,
  updateUser, // Ensure correct import path
} from "../Controller/user.controller.js";
import { fileupload, verifySign } from "../Controller/upload.controller.js";
import { loginChecker_verifyuser } from "../helper/jwthandler.js";

const router = express.Router();

// Storage configuration for user signature upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images/signature"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Storage configuration for signature verification
const verificationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images/signature-verification"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const verification = multer({ storage: verificationStorage });

// Authentication routes
router.post("/login", login);
router.post("/register", reg);
router.post("/useradminlogin", adminlogin);

// User operations
router.get("/show", getAlluser);
router.delete("/:id", deletesingleuser);
router.put("/update/:id", upload.single("signature"), updateUser);

// Password reset routes
router.post("/forgetpass", forgetpass);
router.patch("/:id", resetpassword);

// Signature upload & verification
router.put("/signupload",loginChecker_verifyuser,upload.single("signature"),updateUser);
// router.post("/signupload",loginChecker_verifyuser,updateUser);

router.post("/verify-sign", loginChecker_verifyuser, verification.single("signature_verification"), verifySign);

export default router;
