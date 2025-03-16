import express from "express";
import {
  reg,
  getAlluser,
  deletesingleuser,
  login,
  forgetpass,
  resetpassword,
  adminlogin,
} from "../Controller/user.controller.js";
import { fileupload, verifySign } from "../Controller/upload.controller.js";
import multer from "multer";
import { loginChecker_verifyuser } from "../helper/jwthandler.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images/signature");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const verificationstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./images/signature-verification");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const verification = multer({ storage: verificationstorage });

router.post("/login", login);
router.post("/register", reg);
router.get("/show", getAlluser);

router.post("/forgetpass", forgetpass);

router.patch(
  "/signupload",
  loginChecker_verifyuser,
  upload.single("signature"),
  fileupload
);
router.post(
  "/verify-sign",
  loginChecker_verifyuser,
  verification.single("signature_verification"),
  verifySign
);

router.post("/useradminlogin", adminlogin);

router.patch("/:id", resetpassword);
//done

router.delete("/:id", deletesingleuser);

export default router;
