import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
    return (
        // Section Container
        <div id="speciality" className="flex flex-col items-center gap-6 py-10 text-gray-800">

            {/* 1. Enhanced Heading */}
            <h1 className="text-3xl font-extrabold border-b-4 border-primary/50 pb-1">
                Find by <span className="text-primary">Speciality</span>
            </h1>
            <p className="sm:w-2/3 text-center text-base text-gray-600">
                Explore our comprehensive list of verified medical specialists and book your appointment instantly.
            </p>

            {/* 2. Enhanced Scroll Container */}
            <div className="flex gap-6 lg:gap-8 pt-8 w-full sm:justify-center overflow-x-auto pb-4 scrollbar-hide">
                {specialityData.map((item) => (
                    <Link
                        key={item.speciality}
                        to={`/doctors/${item.speciality}`}
                        onClick={() => window.scrollTo(0, 0)} // Corrected scroll function
                        // 3. Perfected Card Hover and Styling
                        className="flex flex-col items-center text-sm font-medium text-gray-700 cursor-pointer flex-shrink-0 w-24 sm:w-32 group"
                    >
                        {/* Icon Container: Rounded background, shadow, and strong hover effect */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white p-3 rounded-full shadow-lg border border-gray-100 mb-3 
                                        flex items-center justify-center 
                                        group-hover:shadow-2xl group-hover:bg-primary/10 group-hover:scale-[1.05] 
                                        transition-all duration-300 ease-in-out">

                            <img
                                // Image size adjusted to fit nicely within the container
                                className="w-14 sm:w-20 object-contain transform group-hover:rotate-6 transition-transform duration-500"
                                src={item.image}
                                alt={item.speciality}
                            />
                        </div>

                        {/* Text: Ensure specialty name is legible and beautiful */}
                        <p className="text-center group-hover:text-primary transition-colors duration-300 font-semibold px-1">
                            {item.speciality}
                        </p>
                    </Link>
                ))}
            </div>

            {/* CTA to view all doctors */}
            <Link
                to="/doctors"
                className="mt-6 bg-primary text-white font-bold px-10 py-3 rounded-full shadow-lg hover:bg-primary-dark hover:scale-[1.03] transition-all duration-300"
            >
                View All Specialties
            </Link>
        </div>
    );
};

export default SpecialityMenu;