import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
    const navigate = useNavigate();

    return (
        // Goo Level Banner Styling: Added a deep shadow for visual pop.
        <div className="flex bg-primary rounded-2xl overflow-hidden shadow-2xl shadow-primary/40">

            {/* Left: Text and CTA (Increased Padding and Text Size) */}
            {/* 💡 CHANGE: Increased vertical padding (py-10 up to py-28) */}
            <div className="flex-1 py-10 sm:py-16 md:py-24 lg:py-28 pl-6 sm:pl-10 md:pl-14 lg:pl-16 pr-6 md:pr-0">
                {/* 💡 CHANGE: Increased base and responsive text sizes (text-2xl up to text-6xl) */}
                <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    <p>Book Your Next Appointment</p>
                    <p className="mt-4 font-light">With 100+ Trusted Doctors</p>
                </div>

                {/* 2. Enhanced Button Styling: Stronger shadows and transition */}
                <button
                    onClick={() => { navigate("/login"); window.scrollTo(0, 0); }}
                    className="
                        bg-white 
                        text-base 
                        text-gray-700 
                        font-bold
                        px-10 py-3 
                        rounded-full 
                        mt-8 
                        shadow-xl 
                        shadow-black/20
                        
                        // Enhanced Hover Effect
                        hover:scale-[1.05] 
                        hover:shadow-2xl
                        active:scale-[0.98]
                        transition-all 
                        duration-300
                    "
                >
                    Create Your Account Now
                </button>
            </div>

            {/* Right: Image (Hidden on small screens) */}
            {/* 💡 CHANGE: Increased image container width on large screens (lg:w-[450px]) */}
            <div className="hidden md:block md:w-1/2 lg:w-[450px] relative">
                <img
                    // Ensures the image sits perfectly at the bottom edge of the banner
                    className="w-full absolute bottom-0 right-0 max-w-lg object-contain transform translate-y-1"
                    src={assets.appointment_img}
                    alt="Doctor holding a clipboard, ready for appointment"
                />
            </div>
        </div>
    );
};

export default Banner;