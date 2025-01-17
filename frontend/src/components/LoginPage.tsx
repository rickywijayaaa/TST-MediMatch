import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../../firebase"; // Import Firebase setup

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState<string>(""); // Popup message
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Success or failure popup
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful:", result.user);
      setPopupMessage("Login Successful! Redirecting to your homepage...");
      setIsSuccess(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/home");
      }, 2500);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setPopupMessage("Google Sign-In failed. Please try again.");
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", result.user);
      setPopupMessage("Login Successful! Redirecting to your homepage...");
      setIsSuccess(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/home");
      }, 2500);
    } catch (error) {
      console.error("Login failed:", error);
      setPopupMessage("Login failed. Please check your email and password.");
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    }
  };

  const handleSignUpNavigation = () => {
    navigate("/signup");
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

        <form onSubmit={handleLogin}>
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
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-4 bg-white text-black py-2 rounded-lg flex items-center justify-center border border-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
          >
            <img src={google} alt="Google Logo" className="h-5 mr-2" />
            Sign in with Google
          </button>

          <p className="text-grayText text-center mt-4">
            Don&apos;t have an account?{" "}
            <span
              onClick={handleSignUpNavigation}
              className="text-primary underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
