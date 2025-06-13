import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import sltHome from "../assets/sltHome.webp";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigation function

  const handleGetStarted = () => {
    navigate("/new-request"); // Navigate to the new-request page
  };

  return (
    <div className="relative w-full h-screen">
      {/* Full-width Image */}
      <img 
        src={sltHome} 
        alt="SLT Gate Pass" 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Content Overlay */}
      <div className="relative flex flex-col items-center justify-center text-center h-full px-6 bg-black bg-opacity-40">
        <h1 className="text-8xl font-bold text-white drop-shadow-lg">
          Welcome to SLT Gate Pass
        </h1>
        <p className="mt-4 text-lg text-white font-medium">
          Seamless gate pass management for your security needs.
        </p>
        <button 
          onClick={handleGetStarted} 
          className="mt-6 px-6 py-3 bg-[#1B3D81] text-white font-semibold rounded-full shadow-md hover:bg-[#3C5A99] transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
