import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./Login";
import { motion } from "framer-motion";
import { LogOut, LogIn, Home, Users, Info, User } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authorization");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="bg-gray-200 shadow shadow-gray-300 w-full px-2 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Logo */}
        <motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  className="md:order-1 text-2xl md:text-3xl font-semibold italic text-gray-700 tracking-wide"
>
  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
    SignifySecure
  </span>   
</motion.div>

        {/* Navigation Links */}
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between space-x-6">
            <li className="md:px-4 md:py-2 text-indigo-500 flex items-center gap-2">
              <Home size={20} />
              <Link to="/">Home</Link>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400 flex items-center gap-2">
              <Users size={20} />
              <Link to="/userlist">User List</Link>
            </li>
            <li className="md:px-4 md:py-2 hover:text-indigo-400 flex items-center gap-2">
              <Info size={20} />
              <Link to="/about-us">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Login / Logout Section */}
        <div className="order-2 md:order-3 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 font-semibold">{user.name}</span>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <LogIn size={20} />
              <span>Login</span>
            </motion.button>
          )}
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
};

export default Navbar;