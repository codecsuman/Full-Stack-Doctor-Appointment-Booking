import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    // Primary Container: Full-width, distinct background, and bottom padding
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:grid md:grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-12 text-sm">

          {/* Column 1: Logo, Description & Socials */}
          <div className="flex flex-col gap-4">

            {/* ⭐️ ENHANCED LOGO STYLING ⭐️ */}
            <img
              // Increased size and added shadow/brightness filter for visual pop (goo level)
              className="w-52 mb-4 filter drop-shadow-md brightness-110"
              // Using assets.logo as requested, assuming it is high-contrast or white
              src={assets.logo}
              alt="Prescripto Company Logo"
            />
            {/* ----------------------------- */}

            <p className="w-full text-gray-400 leading-relaxed font-light">
              Prescripto is your trusted platform to book appointments with verified doctors and manage your healthcare journey with ease.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              {/* Icons are styled for subtle opacity and hover effect */}
              <img className="w-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" src={assets.facebook_icon} alt="Facebook" />
              <img className="w-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" src={assets.twitter_icon} alt="Twitter" />
              <img className="w-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" src={assets.linkedin_icon} alt="LinkedIn" />
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <p className="text-lg font-bold mb-5 text-white uppercase tracking-wider border-b-2 border-primary pb-1">COMPANY</p>
            <ul className="flex flex-col gap-3 text-gray-400">
              <li className="cursor-pointer hover:text-primary transition-colors">Home</li>
              <li className="cursor-pointer hover:text-primary transition-colors">About Us</li>
              <li className="cursor-pointer hover:text-primary transition-colors">Find Doctors</li>
              <li className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</li>
            </ul>
          </div>

          {/* Column 3: Resources/Support Links */}
          <div>
            <p className="text-lg font-bold mb-5 text-white uppercase tracking-wider border-b-2 border-primary pb-1">SUPPORT</p>
            <ul className="flex flex-col gap-3 text-gray-400">
              <li className="cursor-pointer hover:text-primary transition-colors">Help Center</li>
              <li className="cursor-pointer hover:text-primary transition-colors">Careers</li>
              <li className="cursor-pointer hover:text-primary transition-colors">FAQ</li>
              <li className="cursor-pointer hover:text-primary transition-colors">Contact Us</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <p className="text-lg font-bold mb-5 text-white uppercase tracking-wider border-b-2 border-primary pb-1">GET IN TOUCH</p>
            <ul className="flex flex-col gap-3 text-gray-400">
              <li className="flex items-center gap-2">
                <img className="w-4 h-4 opacity-70" src={assets.phone_icon} alt="Phone" />
                <span className="hover:text-primary transition-colors cursor-pointer">+91 8597376239</span>
              </li>
              <li className="flex items-center gap-2">
                <img className="w-4 h-4 opacity-70" src={assets.email_icon} alt="Email" />
                <span className="hover:text-primary transition-colors cursor-pointer">support@prescripto.com</span>
              </li>
              <li className="flex items-center gap-2 mt-2">
                <img className="w-4 h-4 opacity-70" src={assets.location_icon} alt="Location" />
                <span>Kolkata, INDIA</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="mt-12 border-gray-700" />

        {/* Copyright Section */}
        <p className="py-5 text-sm text-center text-gray-500">
          Copyright &copy; 2024 Prescripto.com. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;