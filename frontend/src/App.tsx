import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar Component
import LoginPage from "./components/LoginPage"; // Login Page Component
import SignUpPage from "./components/SignUpPage"; // Sign-Up Page Component
import HeroSection from "./components/HeroSection"; // Hero Section Component
import HomePage from "./components/HomePage"; // Home Page Component
import GenerateApi from "./components/GenerateApi"; // Generate API Key Page Component

const App: React.FC = () => {
  const location = useLocation();

  // List of paths where Navbar should not be displayed
  const hideNavbarPaths = ["/login", "/signup","/home"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/LoginPage.tsx" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/hero" element={<HeroSection />} /> 
        <Route path="/generate-api" element={<GenerateApi />} />
      </Routes>
    </>
  );
};

// Wrap App with Router
const WrappedApp: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default WrappedApp;
