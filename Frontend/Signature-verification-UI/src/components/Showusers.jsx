import React, { useState, useEffect } from "react";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function Showusers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("authorization");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await axios.get("/show");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    let response = await axios.delete(`/${userId}`);
    if (response.data.message === "user deleted successfully") {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setUsers(users.filter(user => user._id !== userId));
    } else {
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
        <motion.h1
          className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          List of Users
        </motion.h1>

        {/* Responsive Table Container */}
        <motion.div
          className="w-full max-w-3xl md:max-w-4xl lg:max-w-7xl bg-white shadow-lg rounded-xl p-4 border border-gray-200 overflow-x-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-center font-medium">#</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 text-center font-medium">Signature</th>
                <th className="p-4 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4 text-gray-800">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-center">
                      {user.signature ? (
                        <img
                          src={`http://localhost:4000/signature/${user.signature}`}
                          alt="Signature"
                          className="w-20 h-14 rounded-lg shadow border border-gray-300"
                        />
                      ) : (
                        <p className="text-gray-400">N/A</p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <motion.button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        <ToastContainer />
      </div>
    </>
  );
}
