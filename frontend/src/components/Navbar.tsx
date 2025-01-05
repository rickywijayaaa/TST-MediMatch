import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import logo from "../assets/logo.png"; // Import the logo image

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSignIn = () => {
    navigate("/LoginPage.tsx"); // Navigate to the LoginPage when clicked
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white shadow-md border-b border-gray-300">
      {/* Logo Section */}
      <div className="md:pl-16">
        <img src={logo} alt="MediMatch Logo" className="h-8" />
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-grayText">
      </ul>

      {/* Sign In Button */}
      <button
        className="bg-primary text-white px-4 py-2 rounded-md"
        onClick={handleSignIn}
      >
        Sign in
      </button>
    </nav>
  );
};

export default Navbar;
