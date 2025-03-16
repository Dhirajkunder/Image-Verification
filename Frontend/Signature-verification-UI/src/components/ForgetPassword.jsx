import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [forgetpage, setforgetpage] = useState({
    email: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setforgetpage({ ...forgetpage, [name]: value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    let response = await axios.post("/forgetpass", forgetpage);
    if (
      response.data.message === `Link sent successfully to ${forgetpage.email}`
    ) {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      setforgetpage({ email: "" });
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/forget-password");
      }, 1200);
    }

    try {
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <>
    
      <div style={{display:"flex", justifyContent:"center"}}>
        <div className="centerdiv">
        <h2>Forgot Password</h2>
        <form
          style={{ maxWidth: "300px", margin: "auto" }}
          onSubmit={handlesubmit}
        >
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              value={forgetpage.email}
              onChange={handlechange}
              name="email"
              placeholder="Enter your email"
              style={{ width: "100%", padding: "10px" }}
              required
            />
          </div>
          <button style={{ padding: "10px 20px" }}>Submit</button>
        </form>
        </div>

      </div>

      
      <ToastContainer></ToastContainer>
    </>
  );
}
