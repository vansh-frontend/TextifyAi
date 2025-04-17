import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">TextifyAi</h1>

      {/* Social Icons */}
      <div className="flex space-x-4">
        <a 
          href="mailto:vanshdhalor10001@gmail.com" 
          className="text-gray-600 hover:text-red-500 transition"
        >
          <FaEnvelope size={24} />
        </a>
        <a 
          href="https://github.com/vansh-frontend" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black transition"
        >
          <FaGithub size={24} />
        </a>
        <a 
          href="https://www.linkedin.com/in/vansh-dhalor-000a7524a/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-700 transition"
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </header>
  );
};

export default Header;
