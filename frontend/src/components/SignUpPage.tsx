import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/logo.png"; // MediMatch logo
import { auth, createUserWithEmailAndPassword } from "../../firebase"; // Firebase setup

const SignUpPage: React.FC = () => {
  const [name, setName] = useState<string>(""); // State for name input
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState<string>(""); // Popup message
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Success or failure popup
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Create a new user with email and password in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", result.user);

      // Mock saving additional user info (e.g., name) to Firestore
      console.log("Saving additional user info:", { name });

      setPopupMessage("Sign-Up Successful! Redirecting to your homepage...");
      setIsSuccess(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/home"); // Navigate to the homepage route
      }, 2500);
    } catch (error: any) {
      console.error("Sign-Up failed:", error);

      // Check error code for email already in use
      if (error.code === "auth/email-already-in-use") {
        setPopupMessage("Email is already registered. Please try logging in.");
      } else {
        setPopupMessage("Sign-Up failed. Please try again.");
      }
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      {/* Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`bg-white rounded-lg p-6 shadow-lg text-center ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">
              {isSuccess ? "Success!" : "Error"}
            </h2>
            <p className="text-gray-700">{popupMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="MediMatch Logo" className="h-12" />
        </div>

        <form onSubmit={handleSignUp}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-grayText mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-grayText mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-grayText mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-grayText text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
