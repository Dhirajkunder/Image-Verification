import React, { useState, useEffect } from "react";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { Edit, Trash2 } from "lucide-react"; // Import icons

export default function Showusers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedSignature, setEditedSignature] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let response = await axios.get("/show");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (userId) => {
    let response = await axios.delete(`/${userId}`);
    if (response.data.message === "user deleted successfully") {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setUsers(users.filter((user) => user._id !== userId));
    } else {
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedSignature(null);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedName);
      formData.append("email", editedEmail);
      if (editedSignature) {
        formData.append("signature", editedSignature);
      }

      let response = await axios.put(`/update/${selectedUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.message === "User updated successfully") {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        fetchUsers();
        setSelectedUser(null);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.log('error updating user:', error)
      toast.error("Error updating user", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
        <motion.h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          List of Users
        </motion.h1>

        <motion.div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-4 border border-gray-200 overflow-x-auto">
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
                    className="border-b hover:bg-gray-50 transition"
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
                    <td className="p-4 text-center flex gap-2 justify-center">
                      {/* Edit Icon */}
                      <motion.button
                        onClick={() => handleEdit(user)}
                        className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-600 transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={18} />
                      </motion.button>

                      {/* Delete Icon */}
                      <motion.button
                        onClick={() => handleDelete(user._id)}
                        className="p-3 bg-red-400 text-white rounded-full hover:bg-red-600 transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} />
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

        {selectedUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative border border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

              {/* Modal Title */}
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Edit User Details
              </h2>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 font-medium">Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">
                    Upload Signature
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setEditedSignature(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <motion.button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <ToastContainer />
      </div>
    </>
  );
}
