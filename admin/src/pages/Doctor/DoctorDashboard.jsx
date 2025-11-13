import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  // Destructure state and functions from DoctorContext
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);

  // Destructure utility functions from AppContext
  const { slotDateFormat, currency } = useContext(AppContext);

  // Effect to fetch dashboard data specific to the doctor
  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  // Conditional rendering: don't render anything if dashData is not yet available
  if (!dashData) return null;

  return (
    <div className="p-6">
      {/* === KPI Cards Section === */}
      <div className="flex flex-wrap gap-4 justify-start">
        {/* Earnings Card */}
        <div className="dashboard-card flex items-center gap-4 bg-white p-5 rounded-lg shadow-lg min-w-56 border">
          <img src={assets.earning_icon} className="w-12 h-12" alt="Earnings icon" />
          <div>
            <h3 className="text-2xl font-bold text-green-700">
              {currency} {dashData.earnings || 0}
            </h3>
            <p className="text-gray-500 text-sm">Total Earnings</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="dashboard-card flex items-center gap-4 bg-white p-5 rounded-lg shadow-lg min-w-56 border">
          <img src={assets.appointments_icon} className="w-12 h-12" alt="Appointments icon" />
          <div>
            <h3 className="text-2xl font-bold text-blue-600">{dashData.appointments}</h3>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="dashboard-card flex items-center gap-4 bg-white p-5 rounded-lg shadow-lg min-w-56 border">
          <img src={assets.patients_icon} className="w-12 h-12" alt="Patients icon" />
          <div>
            <h3 className="text-2xl font-bold text-red-600">{dashData.patients}</h3>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
        </div>
      </div>

      {/* === Latest Bookings Section === */}
      <div className="mt-8 bg-white border rounded-lg shadow-lg max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <img src={assets.list_icon} className="w-6 h-6" alt="List icon" />
          <p className="font-bold text-lg text-gray-800">Latest Bookings</p>
        </div>

        {/* List Items */}
        {dashData.latestAppointments.slice(0, 5).map((item, i) => (
          <div
            key={i}
            className="latest-row flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            {/* Patient Info */}
            <img
              src={item.userData.image || assets.default_user}
              className="w-10 h-10 rounded-full object-cover mr-4"
              alt="Patient profile"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.userData.name || "Unknown Patient"}</p>
              <p className="text-sm text-gray-500">
                Booking on {slotDateFormat(item.slotDate)}
              </p>
            </div>

            {/* Status / Action */}
            {item.cancelled ? (
              <span className="status-cancel text-red-500 text-xs font-bold bg-red-100 p-1 rounded">Cancelled</span>
            ) : item.isCompleted ? (
              <span className="status-done text-green-600 text-xs font-bold bg-green-100 p-1 rounded">Completed</span>
            ) : (
              // Actions for Pending appointments
              <div className="flex gap-2">
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

export default DoctorDashboard;