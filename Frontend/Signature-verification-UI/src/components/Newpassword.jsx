import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

const Newpassword = () => {
  const location = useNavigate();
  let { id } = useParams();
  const [form, setform] = useState({
    pass: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      let reponse = await axios.patch(`/${id}`, form);
      if (reponse.data.message === "password updated successfully") {
        setTimeout(() => {
          location("/login");
        }, 1100);
        toast.success(reponse.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error(reponse.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      if (AxiosError) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error("internal server error", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <>
      <div>
        <h1> Enter new password</h1>
        <form onSubmit={handlesubmit}>
          <div>
            <span>Password: </span>
            <input
              type="password"
              placeholder="Enter new password"
              name="pass"
              onChange={handlechange}
              value={form.password}
              required
            />
          </div>
          <button type="submit"> submit</button>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Newpassword;
