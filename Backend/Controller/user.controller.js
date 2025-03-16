import user from "../model/index.js";
import mongoose from "mongoose";
import { setuser } from "../helper/jwthandler.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const reg = async (req, res) => {
  try {
    const saltround = 10;
    let password = await bcrypt.hash(req.body.password, saltround);
    await user
      .create({
        name: req.body.name,
        email: req.body.email,
        pass: password,
      })
      .then((re) => {
        if (re) {
          let isUserExist = re;
          let token = setuser({ isUserExist });
          return res
            .status(200)
            .json({ data: `user registration successfully`, token: token });
        }
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({ data: "user registration failed" });
        }
      });
  } catch (error) {
    if (error) {
      return res.status(500).json({ data: "Internal server error" });
    }
  }
};

const getAlluser = async (req, res) => {
  try {
    await user
      .find({ deleted: false })
      .then((re) => {
        if (re) {
          if (re.length > 0) {
            return res.status(200).json({ data: re });
          } else {
            return res.status(200).json({ data: re });
          }
        }
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({ data: "failed to fetch the users" });
        }
      });
  } catch (error) {
    if (error) {
      return res.status(500).json({ data: "Internal server error" });
    }
  }
};

const login = async (req, res) => {
  try {
    let isUserExist = await user.findOne({ email: req.body.email });
    if (!isUserExist) {
      return res.json({ message: "email ID does not exist" });
    } else {
      bcrypt.compare(req.body.password, isUserExist["pass"], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "error in login " });
        }
        if (result) {
          let token = setuser({ isUserExist });
          return res
            .status(200)
            .json({ message: "login successfully", accesstoken: token });
        } else {
          return res
            .status(200)
            .json({ message: "incorrect Email or password " });
        }
      });
    }
  } catch (error) {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const deletesingleuser = async (req, res) => {
  try {
    console.log(req.params.id);
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);

      let isuserexit = await user.findById({ _id: objectId });

      if (isuserexit) {
        await user
          .findByIdAndUpdate(
            {
              _id: objectId,
            },
            {
              deleted: true,
            }
          )
          .then((re) => {
            if (re) {
              return res
                .status(200)
                .json({ message: "user deleted sucessfully" });
            }
          })
          .catch((err) => {
            if (err) {
              return res
                .status(200)
                .json({ message: "user deleted unsucessfully" });
            }
          });
      } else {
        res.status(200).json({ message: "id does not exits" });
      }
    } else {
      return res.status(400).json({ message: "invalid user ID " });
    }
  } catch (error) {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const forgetpass = async (req, res) => {
  let email = req.body.email;
  await user.findOne({ email: email }).then((re) => {
    if (re) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "gauravchindarkar45@gmail.com",
          pass: "knmb oqoe ociz fwka",
        },
        secure: false, // Use this when the environment has certificate issues
        tls: {
          rejectUnauthorized: false, // Ignore certificate errors
        },
      });

      const mailOptions = {
        from: "cyberversatile22@gmail.com",
        to: re.email,
        subject: "reset password Link",
        text: `http://localhost:5173/user/${re._id}`,
      };
      try {
        transporter.sendMail(mailOptions);
        return res
          .status(200)
          .json({ message: `Link sent successfully to ${re.email}` });
      } catch (error) {
        if (error) {
          return res.status(500).json({ message: "failed to send a Link" });
        }
      }
    } else {
      return res.status(200).json({ message: "email ID does not exist" });
    }
  });
};

const resetpassword = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      let isuserexit = await user.findOne({ _id: objectId, deleted: false });
      if (isuserexit) {
        const saltround = 10;
        let password = await bcrypt.hash(req.body.pass, saltround);
        await user
          .findByIdAndUpdate(
            {
              _id: objectId,
            },
            {
              pass: password,
            }
          )
          .then((re) => {
            if (re) {
              return res
                .status(200)
                .json({ message: "password updated successfully" });
            }
          })
          .catch((err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "password updated failed" });
            }
          });
      } else {
        return res.status(200).json({ message: "user id not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid BSON ID" });
    }
  } catch (error) {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const adminlogin = (req, res) => {
  const { name, password } = req.body;
  if (name === "admin" && password === "admin") {
    return res.status(200).json({ message: "login successfully" });
  } else {
    return res.status(200).json({ message: "Invalid Username and password" });
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
