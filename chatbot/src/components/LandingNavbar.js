import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../cssStyles/Button.css";

const Button = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const handleSignUp = () => {
    navigate("/SignUp"); // Directs user to chat page on Get Started click
  };

  const handleHover = () => {
    setHovered(!hovered);
  };

  useEffect(() => {
    // Add transition effects here if needed
  }, [hovered]);

  return (
    <button
      className="custom-button"
      style={{
        "--primary-color": "#ffffff",
        "--secondary-color": "#141F0E",
        "--hover-color": "#ffffff",
        "--arrow-width": "10px",
        "--arrow-stroke": "2px",
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={handleSignUp}
    >
      <span>Sign Up</span>
      <span className="arrow-wrapper">
        <span className="arrow"></span>
      </span>
    </button>
  );
};

function LandingNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="px-6 lg:px-12 py-4 flex flex-row justify-between items-center">
        <div className="text-xl md:text-2xl font-bold text-primary text-black">
          <Link to="/">SEM's LLM</Link>
        </div>
        <div className="flex flex-row justify-between items-center space-x-4 md:space-x-8">
          <Link
            to="/login"
            className="text-sm md:text-base hover:text-[#141F0E] transition duration-300 text-[#0f4430]"
          >
            Login
          </Link>
          <Button />
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;