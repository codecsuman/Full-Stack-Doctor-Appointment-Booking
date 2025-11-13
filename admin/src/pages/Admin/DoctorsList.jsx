import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  // Destructure state and functions from AdminContext
  const { doctors, changeAvailability, aToken, getAllDoctors } =
    useContext(AdminContext);

  // Fetch all doctors when the component mounts and aToken is available
  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-xl font-bold mb-5 text-gray-800">All Doctors</h1>

      <div className="flex flex-wrap gap-4 pt-5">
        {/* Map over the doctors array to create a card for each doctor */}
        {doctors.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl w-60 overflow-hidden shadow-lg hover:shadow-xl 
                       cursor-pointer group transition-all duration-300 transform hover:scale-[1.02]"
          >
            {/* Doctor Image */}
            <div className="w-full h-40 flex items-center justify-center bg-[#EAEFFF] group-hover:bg-blue-100 transition-all duration-300">
              <img
                src={item.image}
                className="w-full h-full object-cover"
                alt={`${item.name} profile`}
              />
            </div>

            <div className="p-4 bg-white">
              <p className="text-lg font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600 mb-3">{item.speciality}</p>

              {/* Availability Control */}
              <div className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                />
                <p className={`font-medium ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;