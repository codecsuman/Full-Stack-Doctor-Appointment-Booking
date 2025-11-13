import React, { useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  // Destructure state and functions from AdminContext
  const { aToken, appointments, cancelAppointment, getAllAppointments } =
    useContext(AdminContext);

  // Destructure utility functions from AppContext
  const { slotDateFormat, calculateAge, currency } =
    useContext(AppContext);

  // Effect to fetch all appointments when the admin token is available
  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]); // Dependency array ensures it runs only when aToken changes

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* Appointment Table Container */}
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        {/* Table Header (Desktop/Tablet View) */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-700 bg-gray-100 sticky top-0 z-10">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* List of Appointments */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 
              sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
              items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            {/* # (Index) */}
            <p className="max-sm:hidden">{index + 1}</p>

            {/* PATIENT */}
            <div className="flex items-center gap-2">
              <img
                src={item?.userData?.image || assets.default_user}
                className="w-8 h-8 object-cover rounded-full"
                alt="user"
              />
              <p className="font-medium text-gray-700">
                {item?.userData?.name || "Unknown User"}
              </p>
            </div>

            {/* AGE */}
            <p className="max-sm:hidden">
              {item?.userData?.dob
                ? calculateAge(item.userData.dob) // Calculate age using the helper function
                : "N/A"}
            </p>

            {/* DATE + TIME */}
            <p className="font-mono">
              {item.slotDate
                ? `${slotDateFormat(item.slotDate)}, ${item.slotTime}` // Format date using helper function
                : "N/A"}
            </p>

            {/* DOCTOR */}
            <div className="flex items-center gap-2">
              <img
                src={item?.docData?.image || assets.default_doctor}
                className="w-8 h-8 object-cover rounded-full bg-gray-200"
                alt="doctor"
              />
              <p className="font-medium text-gray-700">
                {item?.docData?.name || "Unknown Doctor"}
              </p>
            </div>

            {/* FEES */}
            <p className="font-semibold text-green-600">
              {currency}
              {item.amount || 0}
            </p>

            {/* ACTION / STATUS */}
            {item.cancelled ? (
              <p className="text-red-500 text-xs font-bold bg-red-100 p-1 rounded">
                Cancelled
              </p>
            ) : item.isCompleted ? (
              <p className="text-green-600 text-xs font-bold bg-green-100 p-1 rounded">
                Completed
              </p>
            ) : (
              // Cancel action for pending appointments
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                src={assets.cancel_icon}
                alt="cancel"
                title="Cancel Appointment"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;