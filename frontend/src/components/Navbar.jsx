import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

// Define the light blue color using a custom style
const lightBlue = "rgb(104, 199, 228)";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  // Define shared NavLink classes for the new styling
  const navLinkClass = ({ isActive }) =>
    // 💡 CHANGE: Smaller padding (px-4 py-2), darker and bolder text (text-gray-950, font-bold)
    `px-4 py-2 text-base rounded-xl transition duration-300 flex items-center gap-2
     font-bold 
     bg-[${lightBlue}] 
     text-gray-950 
     border-2 border-purple-600 
     shadow-md shadow-purple-200
     
     ${isActive
      // Active State: Darker purple border and shadow
      ? `border-purple-800 shadow-lg shadow-purple-500/50`
      // Hover State: Darker background on hover
      : `hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50`
    }`;

  return (
    // Navbar container (no border, slight shadow)
    <div className="flex items-center justify-between py-4 mb-5 
        rounded-xl px-4 sm:px-8 md:px-12 shadow-sm">

      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-36 sm:w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Menu - Increased Space (gap-6) */}
      <ul className="md:flex items-center gap-6 hidden">
        <NavLink to="/" className={navLinkClass}>
          HOME
        </NavLink>
        <NavLink to="/doctors" className={navLinkClass}>ALL DOCTORS</NavLink>
        <NavLink to="/about" className={navLinkClass}>ABOUT</NavLink>
        <NavLink to="/contact" className={navLinkClass}>CONTACT</NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Logged In Dropdown (no major changes) */}
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-900"
              src={userData.image}
              alt="Profile"
            />
            <img className="w-3" src={assets.dropdown_icon} alt="Dropdown" />

            <div
              className="absolute top-0 right-0 pt-14 hidden group-hover:block z-20"
            >
              <div className="min-w-48 bg-white rounded-lg shadow-xl border px-4 py-3 flex flex-col gap-3 text-gray-700">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-red-500 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Login Button: Updated to use bold text and new light blue color
          <button
            onClick={() => navigate("/login")}
            className={`bg-[${lightBlue}] text-gray-950 px-8 py-2 text-base rounded-full hidden md:block
              font-bold hover:bg-cyan-500 transition duration-300 shadow-lg hover:shadow-xl
              border-2 border-purple-600 hover:border-purple-800`}
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-7 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${showMenu ? "fixed w-full" : "w-0 h-0"
            } right-0 top-0 bottom-0 bg-white z-20 transition-all overflow-hidden`}
        >
          <div className="flex items-center justify-between px-5 py-6 border-b">
            <img src={assets.logo} className="w-36" alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7 cursor-pointer"
              alt="Close"
            />
          </div>

          <ul className="flex flex-col items-center gap-4 mt-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">HOME</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">ALL DOCTORS</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">ABOUT</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">CONTACT</NavLink>
          </ul>

          {!token && (
            // Mobile Create Account Button: Updated for visibility
            <button
              onClick={() => {
                navigate("/login");
                setShowMenu(false);
              }}
              className={`mt-8 bg-[${lightBlue}] text-gray-950 px-8 py-3 rounded-full font-bold border-2 border-purple-600`}
            >
              Create account
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;