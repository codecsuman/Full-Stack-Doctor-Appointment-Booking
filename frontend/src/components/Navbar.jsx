import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  // Renamed state to reflect click-toggle functionality
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const adminToken = localStorage.getItem("aToken");

  useEffect(() => {
    if (adminToken) {
      window.location.href = "http://localhost:5174";
    }
  }, [adminToken]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const buttonBaseStyle = "px-6 py-2.5 rounded-full font-bold shadow-md transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98]";

  return (
    <div className="sticky top-0 z-10 bg-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm py-3">

        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-40 cursor-pointer filter drop-shadow-sm"
          src={assets.logo}
          alt="Logo"
        />

        {/* Desktop Menu */}
        <ul className="md:flex items-center gap-6 font-medium text-gray-700 hidden">

          {[
            { to: "/", label: "HOME" },
            { to: "/doctors", label: "ALL DOCTORS" },
            { to: "/about", label: "ABOUT" },
            { to: "/contact", label: "CONTACT" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `py-1 border-b-2 border-transparent transition-all duration-200 cursor-pointer 
                                ${isActive
                  ? "text-primary border-b-primary font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:border-b-gray-400"}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Admin Button */}
          {!adminToken && (
            <li>
              <button
                onClick={() => window.location.href = "http://localhost:5174/login"}
                className={`${buttonBaseStyle} bg-gray-800 text-white shadow-black/30 hover:bg-black text-xs`}
              >
                Admin Panel
              </button>
            </li>
          )}
        </ul>

        {/* Right section: Profile, Auth, Mobile Menu */}
        <div className="flex items-center gap-4">

          {/* Admin Badge */}
          {adminToken && (
            <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-pulse">
              ADMIN MODE
            </div>
          )}

          {/* User logged in (Profile Dropdown) - Click-to-Toggle */}
          {token && userData ? (
            <div
              // ⭐️ NEW: Toggle state on click ⭐️
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="cursor-pointer relative"
            >
              {/* Profile Icon: Now acts as the toggle button */}
              <div className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <img className="w-9 h-9 rounded-full object-cover border-2 border-primary/50 shadow-md" src={userData.image || assets.default_user} alt="Profile" />
                {/* Rotation reflects menu state */}
                <img className={`w-3 transform transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="Dropdown" />
              </div>

              {/* Dropdown Menu with Smooth Transition */}
              <div
                // Menu visibility controlled by CSS transition based on state
                className={`absolute top-full right-0 mt-3 transition-all duration-300 origin-top-right z-20 
                                            ${showProfileDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <div className="min-w-40 bg-white rounded-lg flex flex-col gap-1 p-3 text-base font-medium text-gray-700 shadow-xl border border-gray-100">
                  {[
                    { label: "My Profile", path: "/my-profile" },
                    { label: "My Appointments", path: "/my-appointments" },
                  ].map((item) => (
                    <p
                      key={item.path}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop click from propagating to the parent div
                        navigate(item.path);
                        setShowProfileDropdown(false); // Close after navigation
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                    >
                      {item.label}
                    </p>
                  ))}

                  <hr className="my-1 border-gray-200" />

                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                      setShowProfileDropdown(false); // Close after logout
                    }}
                    className="px-3 py-2 cursor-pointer text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Not logged in (CTA Button)
            !adminToken && (
              <button
                onClick={() => navigate("/login")}
                className={`${buttonBaseStyle} bg-primary text-white shadow-primary/40 hover:bg-primary-dark hidden md:block`}
              >
                Create account
              </button>
            )
          )}

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setShowMenu(true)}
            className="w-7 cursor-pointer md:hidden"
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>

        {/* Mobile Menu Drawer (Transition maintained) */}
        <div
          className={`fixed h-full top-0 right-0 bg-white z-50 transition-all duration-500 shadow-2xl ${showMenu ? "w-80" : "w-0"}`}
        >
          <div className={`${showMenu ? "p-5" : "p-0"} h-full overflow-hidden flex flex-col`}>
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <img src={assets.logo} className="w-36" alt="Logo" />
              <img
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                className="w-7 cursor-pointer"
                alt="Close"
              />
            </div>

            <ul className="flex flex-col gap-3 mt-6 text-lg font-medium text-gray-700">
              {[
                { to: "/", label: "HOME" },
                { to: "/doctors", label: "ALL DOCTORS" },
                { to: "/about", label: "ABOUT" },
                { to: "/contact", label: "CONTACT" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  onClick={() => setShowMenu(false)}
                  to={link.to}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors 
                                        ${isActive ? "text-primary font-bold bg-primary/5" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </ul>

            {/* Admin Button (mobile) */}
            {!adminToken && (
              <button
                onClick={() => window.location.href = "http://localhost:5174/login"}
                className={`${buttonBaseStyle} bg-gray-800 text-white mt-8 mx-3 shadow-black/40`}
              >
                Admin Panel
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;