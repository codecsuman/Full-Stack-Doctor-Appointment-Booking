import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets"; // Assuming assets contains your logos

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    navigate("/login");
  };

  return (
    // Structural Enhancement: Shadow, Fixed Position, Higher Z-index
    <div className="sticky top-0 z-10 flex justify-between items-center py-4 px-8 bg-white shadow-md">

      {/* 🧭 Left Section: Logo & Role Indicator */}
      <div className="flex items-center gap-3">
        <img
          src={assets.admin_logo}
          className="w-36 cursor-pointer transition-opacity duration-300 hover:opacity-80" // Subtle hover on logo
          alt="Admin Logo"
          onClick={() => navigate("/")}
        />
        {/* Role Indicator Enhancement: Better colors, subtle shadow */}
        <p className={`px-4 py-1 rounded-full text-sm font-medium border
          ${aToken
            ? "bg-blue-100 text-blue-700 border-blue-300"
            : "bg-green-100 text-green-700 border-green-300"
          }
        `}>
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      {/* 🔑 Right Section: Logout Button */}
      {(aToken || dToken) && (
        // Logout Button with Beautiful Hover Effect
        <button
          onClick={logout}
          // Initial Style: Primary color, rounded, smooth transition
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md 
                     transition-all duration-300 ease-in-out
                     
                     /* Beautiful Hover Effect: Darken, Lift, and Scale */
                     hover:bg-red-700 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;