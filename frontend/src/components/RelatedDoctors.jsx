import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate();
    // Assuming currency is available via AppContext
    const { doctors, currency } = useContext(AppContext);

    const [relDoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            // Filter: Match specialty AND exclude current doctor
            const filtered = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            ).slice(0, 4); // Limit to 4 for clean layout

            setRelDoc(filtered);
        }
    }, [doctors, speciality, docId]);

    const handleNavigation = (id) => {
        navigate(`/appointment/${id}`);
        // Use window.scrollTo for reliable navigation scroll reset
        window.scrollTo(0, 0);
    };

    // Do not render the entire section if no related doctors are found
    if (relDoc.length === 0) return null;

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-800">
            {/* 1. Enhanced Heading */}
            <h1 className="text-3xl font-extrabold border-b-4 border-primary/50 pb-1">
                More <span className="text-primary">{speciality}</span> Specialists
            </h1>
            <p className="sm:w-2/3 text-center text-base text-gray-600">
                Didn't find what you needed? Browse through other highly-rated doctors in the same field.
            </p>

            {/* 2. Enhanced Grid Layout */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
                {relDoc.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => handleNavigation(item._id)}
                        // 3. Enhanced Card Styling: Shadow, smoother hover, white background
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        {/* Image: Fixed height and object-cover for consistency */}
                        <img
                            className="bg-[#EAEFFF] w-full h-40 object-cover"
                            src={item.image}
                            alt={`Dr. ${item.name}`}
                        />

                        <div className="p-4">
                            {/* Availability Status */}
                            <p className={`flex items-center gap-2 text-sm font-medium mb-1 ${item.available ? "text-green-600" : "text-gray-500"}`}>
                                <span className={`w-2 h-2 rounded-full ${item.available ? "bg-green-600" : "bg-gray-500"}`}></span>
                                {item.available ? "Available" : "Not Available"}
                            </p>

                            <p className="text-xl font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-primary font-semibold mt-0.5">{item.speciality}</p>

                            {/* 4. Added Fees and Experience */}
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

            <button
                onClick={() => handleNavigation("/doctors")}
                className="mt-8 bg-primary text-white font-bold px-10 py-3 rounded-full shadow-lg hover:bg-primary-dark hover:scale-[1.03] transition-all duration-300"
            >
                View All Doctors
            </button>
        </div>
    );
};

export default RelatedDoctors;