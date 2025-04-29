import React from "react";

import Login from "./components/Login";
import Registration from "./components/Registration";
import ForgetPassword from "./components/ForgetPassword";
import Showusers from "./components/Showusers";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Newpassword from "./components/Newpassword";
import { UploadPage } from "./components/UploadPage";
import ForgotPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route
            path="/forget-password"
            element={<ForgetPassword></ForgetPassword>}
          ></Route>
          <Route
            path="/Register-user"
            element={<Registration></Registration>}
          ></Route>
          <Route
            path="/file-upload"
            element={<UploadPage></UploadPage>}
          ></Route>
          <Route path="/userlist" element={<Showusers></Showusers>}></Route>
          <Route path="/About-us" element={<Aboutus></Aboutus>}></Route>
          <Route path="/user/:id" element={<Newpassword></Newpassword>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
