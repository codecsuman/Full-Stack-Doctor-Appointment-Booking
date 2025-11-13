import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        // Container: Dark background for deep contrast, and rounded bottom for a softer transition.
        <div className="bg-[#242A5C] rounded-b-[40px] overflow-hidden shadow-2xl shadow-black/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 lg:gap-16">

                {/* Left: Headline & CTA */}
                <div className="md:w-1/2 flex flex-col items-start justify-center gap-8 py-16 lg:py-32">

                    {/* Headline: Maximized size and weight for impact, using primary color for key words */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white font-extrabold leading-tight">
                        Book <span className="text-primary-light">Appointments</span> <br /> With Trusted Doctors
                    </h1>

                    {/* Social Proof/Description (Cleaned up and emphasized) */}
                    <div className="flex items-center gap-4 text-white text-base font-medium border-l-4 border-primary/70 pl-4 py-2">
                        <p>
                            Instantly access verified specialists and manage your <br className="hidden sm:block" />
                            healthcare needs easily. Your health, simplified.
                        </p>
                    </div>

                    {/* CTA Button: Gold standard button styling - Large, high-contrast, deep shadow, and smooth hover */}
                    <Link
                        to="/doctors"
                        className="flex items-center gap-3 bg-white px-12 py-4 rounded-full text-xl text-primary font-bold shadow-2xl shadow-black/40
                                   hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-in-out mt-4"
                    >
                        Explore Doctors Now
                        {/* Assuming assets.arrow_icon is a simple arrow */}
                        <img className="w-4 ml-1 transform group-hover:translate-x-1 transition-transform" src={assets.arrow_icon} alt="Go" />
                    </Link>
                </div>

                {/* Right: Header Image - PERFECTED */}
                <div className="md:w-1/2 relative w-full pt-4 md:pt-0 flex justify-center md:justify-end items-end min-h-[300px] md:min-h-[450px] lg:min-h-[550px]">
                    <img
                        // **FIXED ERROR HERE** - Using template literal (backticks) for multi-line string:
                        className={`
                            w-[90%] md:w-full lg:w-[110%] 
                            max-w-xl md:max-w-none 
                            object-cover 
                            rounded-t-3xl 
                            shadow-3xl shadow-primary/70 
                            relative md:absolute 
                            bottom-0 left-1/2 md:left-auto md:right-0 
                            transform -translate-x-1/2 md:translate-x-0 
                            md:translate-y-4 lg:translate-y-8 
                            filter saturate-110 drop-shadow-xl 
                            transition-all duration-500 ease-out
                        `}
                        src={assets.header_img}
                        alt="Doctor standing with a successful patient"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;