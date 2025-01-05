import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import { auth, googleProvider, signInWithPopup } from "../../firebase"; // Import Firebase setup

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful:", result.user);
      setShowPopup(true); // Show success popup
      setTimeout(() => {
        setShowPopup(false); // Hide popup after 2 seconds
        navigate("/home"); // Navigate to the HeroPage route
      }, 2500);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    // Mock successful login
    setShowPopup(true); // Show success popup
    setTimeout(() => {
      setShowPopup(false); // Hide popup after 2 seconds
      navigate("/home"); // Navigate to the HeroPage route
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Login Successful!
            </h2>
            <p className="text-gray-700">Redirecting to your homepage...</p>
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
            onClick={handleGoogleSignIn} // Add Google Sign-In Handler
            className="w-full mt-4 bg-white text-black py-2 rounded-lg flex items-center justify-center border border-gray-300 hover:bg-gray-800 hover:text-white transition duration-200"
          >
            <img src={google} alt="Google Logo" className="h-5 mr-2" />
            Sign in with Google
          </button>

          <p className="text-grayText text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
