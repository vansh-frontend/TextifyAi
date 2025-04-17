import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="container mx-auto">
        {/* Names & Email */}
        <p className="text-lg font-semibold">Vansh , Anshupreet & Madhav </p>
        <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
          <FaEnvelope className="inline-block text-gray-400 hover:text-red-500 transition" />
          <a 
            href="mailto:vanshdhalor10001@gmail.com" 
            className="hover:underline"
          >
            vanshdhalor10001@gmail.com
          </a>
        </p>

        {/* Social Icons */}
        <div className="flex justify-center mt-3 space-x-4">
          <a 
            href="mailto:vanshdhalor10001@gmail.com"
            className="text-gray-400 hover:text-red-500 transition"
          >
            <FaEnvelope size={24} />
          </a>
          <a 
            href="https://github.com/vansh-frontend/JAVA-OCR-" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaGithub size={24} />
          </a>
          <a 
            href="https://www.linkedin.com/in/vansh-dhalor-000a7524a/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
