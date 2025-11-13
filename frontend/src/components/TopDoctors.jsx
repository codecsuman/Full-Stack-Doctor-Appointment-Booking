import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate = useNavigate();
    // Assuming currency is available via AppContext
    const { doctors, currency } = useContext(AppContext);

    const handleNavigation = (id) => {
        navigate(`/appointment/${id}`);
        // Use window.scrollTo for reliable navigation scroll reset
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex flex-col items-center gap-6 my-16 text-gray-800">
            {/* Heading and Description */}
            <h1 className="text-3xl font-extrabold border-b-4 border-primary/50 pb-1">
                Top <span className="text-primary">Doctors</span> to Book
            </h1>
            <p className="sm:w-2/3 text-center text-base text-gray-600">
                Meet our most trusted and highly-rated medical professionals, ready to provide exceptional care.
            </p>

            {/* Doctors Grid with Enhanced Cards */}
            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 px-4 sm:px-0">
                {doctors.slice(0, 8).map((item) => ( // Limiting to 8 for a cleaner grid on most screens
                    <div
                        key={item._id}
                        onClick={() => handleNavigation(item._id)}
                        // Enhanced Card Styling: Deeper shadow, primary border on hover, white background
                        className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 cursor-pointer 
                                   hover:shadow-2xl hover:scale-[1.02] hover:border-primary transition-all duration-300"
                    >
                        {/* ⭐️ PERFECTED DOCTOR IMAGE CONTAINER ⭐️ */}
                        <div className="w-full aspect-square bg-gradient-to-b from-[#EAEFFF] to-white flex items-center justify-center overflow-hidden relative">
                            <img
                                // Key: object-cover to fill, object-top to focus face, transition for hover effect
                                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500 ease-out"
                                src={item.image}
                                alt={`Dr. ${item.name}`}
                            />
                            {/* Optional: Add an overlay for subtle effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>

                        <div className="p-4">
                            {/* Availability Status with better color and spacing */}
                            <p className={`flex items-center gap-2 text-sm font-medium mb-1 ${item.available ? "text-green-600" : "text-gray-500"}`}>
                                <span className={`w-2 h-2 rounded-full ${item.available ? "bg-green-600" : "bg-gray-500"}`}></span>
                                {item.available ? "Available" : "Not Available"}
                            </p>

                            <p className="text-xl font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-primary font-semibold mt-0.5">{item.speciality}</p>

                            {/* Added Fees and Experience */}
                            <div className="mt-3 flex justify-between items-center border-t pt-2">
                                <p className="text-base font-bold text-gray-700">
                                    {currency}{item.fees}
                                    <span className="text-xs font-normal text-gray-500 ml-1">Fee</span>
                                </p>
                                <span className="text-xs font-semibold text-gray-600 bg-gray-100 py-1 px-2 rounded-full">
                                    {item.experience}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Doctors button */}
            <button
                onClick={() => handleNavigation("/doctors")}
                className="mt-8 bg-primary text-white font-bold px-10 py-3 rounded-full shadow-lg hover:bg-primary-dark hover:scale-[1.03] transition-all duration-300"
            >
                View All Doctors
            </button>
        </div>
    );
};

export default TopDoctors;