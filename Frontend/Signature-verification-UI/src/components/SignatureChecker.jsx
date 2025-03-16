import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaFileUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";

const SignatureChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [buttonState, setButtonState] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file!");
      return;
    }
    setButtonState(true);
    setData(null);

    const token = localStorage.getItem("authorization");
    if (!token) {
      toast.error("No token found, please login");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("signature_verification", file);

    try {
      let response = await axios.post(`/verify-sign`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.message);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    }
    setButtonState(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const removeFile = () => {
    setFile(null);
    setData(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    multiple: false,
  });

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-beige">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[90%] max-w-3xl"
        >
          <h1 className="text-center text-2xl font-bold text-gray-700 mb-6">
            Signature Verification
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              {...getRootProps()}
              className="border-2 border-dashed border-blue-400 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
              whileHover={{ scale: 1.02 }}
            >
              <input {...getInputProps()} />
              <FaFileUpload className="text-blue-500 text-5xl mb-4" />
              <p className="text-gray-600">Drag & Drop your signature</p>
              <p className="text-gray-400 text-sm">or</p>
              <button className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
                Select File
              </button>
            </motion.div>

            <div className="border border-gray-300 p-6 rounded-xl flex items-center justify-center bg-white shadow-inner">
              {file ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-40 h-auto object-contain rounded-lg shadow-md"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition"
                    onClick={removeFile}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">No Files Uploaded Yet</p>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <motion.button
              onClick={uploadFiles}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              Verify Signature
            </motion.button>
          </div>

          {data && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Verification Result</h2>
              <p className="text-lg font-medium text-gray-700">Similarity Score: <span className="text-blue-600">{(data.similarity_score * 100).toFixed(2)}%</span></p>
              <p className="text-lg font-medium text-gray-700">Probability: <span className="text-green-600">{(data.probability * 100).toFixed(2)}%</span></p>
              <p className="text-lg font-medium text-gray-700">Confidence: {data.confidence}</p>
              <p className={`text-lg font-semibold ${data.is_genuine ? "text-green-500" : "text-red-500"}`}>
                Status: {data.is_genuine ? "Genuine" : "Not Genuine"}
              </p>
            </div>
          )}

          {buttonState && <h2 className="text-xl font-semibold text-gray-700 mt-6">Processing...</h2>}
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignatureChecker;
