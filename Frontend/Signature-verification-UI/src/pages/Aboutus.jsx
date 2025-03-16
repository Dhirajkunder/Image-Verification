import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const sections = [
  {
    title: "Digital Signature Verification",
    description:
      "Our platform ensures secure and reliable digital signature verification, enabling businesses and individuals to authenticate documents with confidence. Using cutting-edge cryptographic techniques, we provide a seamless, tamper-proof signing experience.",
    img: "/img/about1.webp",
  },
  {
    title: "AI-Powered Signature Analysis",
    description:
      "Leveraging the power of AI, we analyze handwritten and digital signatures with advanced neural networks. Our system identifies patterns, detects fraud, and ensures authenticity with high precision, making it ideal for banking, legal, and corporate sectors.",
    img: "/img/about2.webp",
  },
  {
    title: "Seamless User Experience",
    description:
      "Our intuitive platform is designed for effortless navigation. With a user-friendly interface, easy signature uploads, and quick verification results, we prioritize efficiency and accuracy, reducing manual effort while maintaining security.",
    img: "/img/about3.webp",
  },
];

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen text-gray-800 flex flex-col items-center px-6 py-12">
        {/* Heading with Animation */}
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>

        {/* Section Container */}
        <div className="max-w-7xl w-full grid gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Image Section */}
              <img
                src={section.img}
                alt={section.title}
                className="w-64 h-64 rounded-lg object-cover shadow-md"
              />
              {/* Text Section */}
              <div className="md:w-3/5 text-center md:text-left px-6">
                <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutUs;
