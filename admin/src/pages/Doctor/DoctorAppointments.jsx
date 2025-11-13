import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  // Destructure state and functions from DoctorContext
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);

  // Destructure utility functions from AppContext
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  // Fetch appointments when the component mounts and the doctor token is available
  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">All Appointments</h2>

      <div className="table-container bg-white border rounded shadow-md overflow-x-auto">
        {/* Table Header (Using CSS Grid for structure - assume doctor-table-header defines the columns) */}
        <div className="table-header doctor-table-header hidden md:grid py-3 px-6 border-b font-medium text-gray-700 bg-gray-100">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Map through appointments */}
        {appointments.map((item, i) => (
          // Table Row (Using CSS Grid for structure - assume doctor-table-row defines the columns)
          <div
            key={i}
            className="table-row doctor-table-row grid grid-cols-[0.3fr_1.5fr_0.8fr_0.5fr_1.5fr_0.8fr_1fr] 
                       items-center text-sm text-gray-700 py-3 px-6 border-b hover:bg-gray-50 transition-colors"
          >
            {/* # */}
            <p>{i + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image || assets.default_user}
                className="w-8 h-8 rounded-full object-cover"
                alt="Patient"
              />
              <p className="font-medium">{item.userData.name || "Unknown Patient"}</p>
            </div>

            {/* Payment */}
            <p className={`payment-badge font-semibold ${item.payment ? 'text-blue-600' : 'text-orange-600'}`}>
              {item.payment ? "Online" : "Cash"}
            </p>

            {/* Age */}
            <p className="text-gray-500">
              {item.userData.dob ? calculateAge(item.userData.dob) : "N/A"}
            </p>

            {/* Date & Time */}
            <p className="font-mono text-xs">
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Fees */}
            <p className="font-bold text-green-600">
              {currency}{item.amount || 0}
            </p>

            {/* Action / Status */}
            {item.cancelled ? (
              <span className="status-cancel text-red-500 text-xs font-bold bg-red-100 p-1 rounded text-center">
                Cancelled
              </span>
            ) : item.isCompleted ? (
              <span className="status-done text-green-600 text-xs font-bold bg-green-100 p-1 rounded text-center">
                Completed
              </span>
            ) : (
              // Actions for Pending appointments (Cancel and Complete)
              <div className="flex gap-2 justify-center">
                {/* Cancel Icon */}
                <img
                  src={assets.cancel_icon}
                  className="action-icon w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => cancelAppointment(item._id)}
                  title="Cancel Appointment"
                  alt="Cancel"
                />
                {/* Complete Icon */}
                <img
                  src={assets.tick_icon}
                  className="action-icon w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => completeAppointment(item._id)}
                  title="Complete Appointment"
                  alt="Complete"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;