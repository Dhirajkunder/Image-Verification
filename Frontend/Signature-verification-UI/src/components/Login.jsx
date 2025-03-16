import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5"; // Import icons for password toggle

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load stored credentials if "Remember Me" was selected
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedEmail && storedPassword) {
      setLoginData({ email: storedEmail, password: storedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("/login", loginData);
      if (response?.data?.accesstoken) {
        localStorage.setItem("authorization", response.data.accesstoken);
        localStorage.setItem("user", JSON.stringify(response.data.user || {}));
        
        // Store credentials if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", loginData.email);
          localStorage.setItem("rememberedPassword", loginData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        toast.success("✅ Login Successful!", { autoClose: 1000 });
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1200);
      } else {
        toast.error(response.data.message || "Invalid credentials", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed", { autoClose: 1000 });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        
        {/* Left Side */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-50">
          <img src="/login-illustration.png" alt="Login Illustration" className="w-3/4" />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Sign in</h2>
          <p className="text-gray-500 text-center mb-6">Sign in to your account and explore a world of possibilities.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">User name</label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Enter user name"
                  required
                />
                <FaUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Enter password"
                  required
                />
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember" className="text-gray-600 text-sm">Remember me</label>
              </div>
              <Link to="/forget-password" className="text-sm text-blue-500 hover:underline">Forgot your password?</Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600">
              Sign in
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?  
            <Link to="/register-user" className="text-blue-500 font-bold hover:underline"> Register here</Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default LoginPage;
