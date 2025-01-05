import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage"; // Import your LoginPage component
import HomePage from "./components/HeroSection"; // Example Home Page
import Home from "./components/HomePage"; // Example Home Page

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "./components/LoginPage" && location.pathname !== "/home" && <Navbar />}



      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/LoginPage.tsx" element={<LoginPage />} />
        <Route path="/hero" element={<HomePage />} /> 
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </>
  );
};

// Wrap App with Router in index.tsx or another parent file
const WrappedApp: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default WrappedApp;
