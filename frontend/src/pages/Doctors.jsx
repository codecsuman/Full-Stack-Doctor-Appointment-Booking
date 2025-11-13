import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
// Assuming assets is imported if used in the actual component, 
// though not directly used in the current card display logic.

const Doctors = () => {
  const { speciality } = useParams();
  // Assume currency is available via AppContext for displaying fees
  const { doctors, currency } = useContext(AppContext);

  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to apply filtering logic
  const applyFilter = () => {
    setLoading(true);

    // Filter logic
    let filteredList = doctors;
    if (speciality) {
      filteredList = doctors.filter((doc) => doc.speciality === speciality);
    }

    // Use a short delay for smooth loading transition (600ms)
    setTimeout(() => {
      setFilterDoc(filteredList);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    // Scroll to the top when filters or doctors data changes (better UX)
    window.scrollTo(0, 0);
    applyFilter();
  }, [doctors, speciality]); // Dependency array: Re-run when doctors data or specialty param changes

  const categories = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  // ⭐ Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="border border-gray-200 bg-white rounded-xl p-4 animate-pulse h-full">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

      <div className="w-4/5 h-5 bg-gray-300 rounded mb-2"></div>
      <div className="w-3/5 h-4 bg-gray-200 rounded mb-1"></div>
      <div className="w-1/3 h-4 bg-gray-300 rounded mb-3"></div>

      <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
        Find Your <span className="text-primary">Specialist</span>
      </h1>
      <p className="text-gray-600 mb-6">Browse through the available doctor specialists below.</p>

      <div className="flex flex-col sm:flex-row gap-8">

        {/* --- Side Filter / Category Panel --- */}
        <div className="sm:w-1/4 flex-shrink-0">
          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`py-2 px-4 border rounded text-base font-medium w-full sm:hidden transition-colors ${showFilter ? "bg-primary text-white" : "text-gray-700 bg-gray-50 border-gray-300"
              }`}
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          {/* DESKTOP/MOBILE FILTER LIST */}
          <div
            className={`flex-col gap-2 text-sm text-gray-700 mt-4 sm:mt-0 
              ${showFilter ? "flex" : "hidden sm:flex"}`
            }
          >
            <h3 className="text-lg font-bold mb-2 text-gray-800">Categories</h3>
            {/* "All Doctors" option */}
            <p
              onClick={() => navigate("/doctors")}
              className={`pl-3 py-2 pr-16 rounded cursor-pointer transition-colors font-medium border border-transparent 
                ${!speciality ? "bg-primary text-white shadow-md hover:bg-primary-dark" : "hover:bg-gray-100"
                }`}
            >
              All Doctors
            </p>

            {/* Specialty Categories */}
            {categories.map((cat) => (
              <p
                key={cat}
                onClick={() =>
                  speciality === cat
                    ? navigate("/doctors") // Clicking active specialty deselects
                    : navigate(`/doctors/${cat}`)
                }
                className={`pl-3 py-2 pr-16 rounded cursor-pointer transition-colors font-medium border border-transparent 
                  ${speciality === cat ? "bg-[#E2E5FF] text-primary font-semibold border-primary/50" : "hover:bg-gray-100"
                  }`}
              >
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* --- DOCTOR LIST / RESULTS --- */}
        <div className="w-full sm:w-3/4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {speciality ? `${speciality} Specialists` : "All Available Doctors"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">

            {/* ⭐ Show skeleton while loading */}
            {loading &&
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)}

            {/* ⭐ Show "No Doctors Found" message */}
            {!loading && filterDoc.length === 0 && (
              <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-lg font-medium text-gray-600">
                  😔 No doctors found for the selected specialty.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try checking the 'All Doctors' category.
                </p>
              </div>
            )}

            {/* Display Filtered Doctors */}
            {!loading &&
              filterDoc.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/appointment/${item._id}`);
                    // Note: window.scrollTo(0, 0) is preferred over just scrollTo(0, 0)
                    // but often unnecessary as navigation handles scroll.
                  }}
                  className="bg-white border border-[#C9D8FF] rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >
                  {/* Doctor Image */}
                  <img
                    className="w-full h-48 object-cover bg-[#EAEFFF]"
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="p-4">
                    {/* Availability Status */}
                    <p
                      className={`flex items-center gap-2 text-sm font-medium mb-1 ${item.available ? "text-green-600" : "text-gray-500"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${item.available ? "bg-green-600" : "bg-gray-500"
                          }`}
                      ></span>
                      {item.available ? "Available" : "Not Available"}
                    </p>

                    <p className="text-xl font-bold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-primary font-semibold mt-0.5">{item.speciality}</p>

                    <div className="mt-3 flex justify-between items-center border-t pt-2">
                      {/* Fees */}
                      <p className="text-base font-bold text-gray-700">
                        {currency}{item.fees}
                        <span className="text-xs font-normal text-gray-500 ml-1">Fee</span>
                      </p>
                      {/* Experience */}
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 py-1 px-2 rounded-full">
                        {item.experience}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;