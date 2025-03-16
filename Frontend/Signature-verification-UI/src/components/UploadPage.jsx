import React, { useState, useCallback } from "react";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import { FaFileUpload } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast.error("Please select a file!");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No token found, please login");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("signature", file);
    });

    try {
      let response = await axios.patch(`/signupload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "File uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload the file.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    multiple: false,
  });

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-beige">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[90%] max-w-3xl"
        >
          <h1 className="text-center text-2xl font-bold text-gray-700 mb-6">
            Upload Your Signature
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Drag & Drop Box */}
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

            {/* Right: File Preview Box */}
            <div className="border border-gray-300 p-6 rounded-xl flex items-center justify-center bg-white shadow-inner">
              {files.length > 0 ? (
                <div>
                  {files.map((file, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-40 h-auto object-contain rounded-lg shadow-md"
                      />
                      <p className="text-gray-600 text-sm mt-2">{file.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No Files Uploaded Yet</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center mt-6">
            <motion.button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              Upload & Save
            </motion.button>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};
