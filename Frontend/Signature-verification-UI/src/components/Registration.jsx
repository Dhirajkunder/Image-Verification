import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import axios from "../axios";

export default function Registration() {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistration({ ...registration, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("/register", registration);
      let message = response.data.data;
      localStorage.setItem("authToken", response.data.token);
      toast.success(message, { position: "top-right", autoClose: 1000 });
      setTimeout(() => navigate("/file-upload"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.data || "Registration failed", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full backdrop-blur-md bg-opacity-80 border border-gray-200"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={handleChange}
                value={registration.name}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={registration.email}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={registration.password}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              Register
            </motion.button>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}