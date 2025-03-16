import React from "react";
import Navbar from "../components/Navbar";
import SignatureChecker from "../components/SignatureChecker";
import { UploadPage } from "../components/UploadPage";

const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SignatureChecker></SignatureChecker>
    </div>
  );
};

export default Home;
