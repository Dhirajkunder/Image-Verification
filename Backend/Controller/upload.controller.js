import user from "../model/index.js";
import mongoose from "mongoose";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fileupload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log(req.user.ID);
  try {
    
    if (mongoose.Types.ObjectId.isValid(req.user.ID)) {
      let objectId = new mongoose.Types.ObjectId(req.user.ID);
      let isuserexit = await user.findById({ _id: req.user.ID });
      if (isuserexit) {
        await user
          .findByIdAndUpdate(
            {
              _id: objectId,
            },
            {
              $set: { signature: req.file.filename },
            }
          )
          .then((re) => {
            if (re) {
              return res
                .status(200)
                .json({ message: "file upload successfully" });
            }
          })
          .catch((err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Internal server error" });
            }
          });
      } else {
        return res.status(200).json({ message: "user does not exist" });
      }
    } else {
      console.log("Kya hua bhai tujhe");
      
      return res.status(400).json({ message: "Invalid BSON id" });
    }
  } catch (error) {
    if (error) {
      console.log(error);
      return res.status(200).json({ message: "Interval server error" });
    }
  }
};

const verifySign = async (req, res) => {
  try {
    let origin = await user.findOne({ _id: req.user.ID });
    if (!req.file) {
      return res.status(200).json({ message: "Please upload a file" });
    }

    function verifySignature(genuinePath, testPath, modelPath) {
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", [
          "./Controller/signature_verification.py",
        ]);

        let dataString = "";
        let errorString = "";

        // Handle Python script output
        pythonProcess.stdout.on("data", (data) => {
          dataString += data.toString();
        });

        // Handle Python script errors
        pythonProcess.stderr.on("data", (data) => {
          errorString += data.toString();
          // Only log actual errors, not warnings
          if (!data.toString().includes("Warning")) {
            console.error(`Error from Python: ${data}`);
          }
        });

        // Handle process completion
        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            reject(
              new Error(
                `Python process exited with code ${code}\n${errorString}`
              )
            );
            return;
          }

          try {
            const result = JSON.parse(dataString);
            if (result.status === "error") {
              reject(new Error(result.error));
              return;
            }
            resolve(result);
          } catch (error) {
            reject(new Error("Failed to parse Python output"));
          }
        });

        // Send data to Python script
        const input = {
          genuine_path: genuinePath,
          test_path: testPath,
          model_path: modelPath,
        };

        pythonProcess.stdin.write(JSON.stringify(input) + "\n");
        pythonProcess.stdin.end();
      });
    }

    let genuinePath = path.join(
      __dirname,
      `../images/signature/${origin.signature}`
    );
    let testPath = path.join(
      __dirname,
      `../images/signature-verification/${req.file.filename}`
    );
    let modelPath = path.join(
      __dirname,
      "logistic_model_triangular_m09_ashoj3.pth"
    );
    let result = await verifySignature(genuinePath, testPath, modelPath);
    return res.status(200).json({ message: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

export { fileupload, verifySign };
