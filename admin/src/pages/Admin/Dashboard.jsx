import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  // Destructure state and functions from AdminContext
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  // Destructure utility functions from AppContext
  const { slotDateFormat } = useContext(AppContext);

  // Effect to fetch dashboard data when the admin token is available
  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]); // Dependency array ensures it runs when aToken changes

  return (
    // Only render the dashboard if dashData has been fetched
    dashData && (
      <div className="m-5">
        {/* === KPI Cards Section === */}
        <div className="flex flex-wrap gap-3">
          {/* Doctors Card */}
          <div className="flex items-center gap-3 bg-white p-4 min-w-52 border rounded hover:scale-105 transition-all shadow-md">
            <img src={assets.doctor_icon} className="w-14" alt="Doctor icon" />
            <div>
              <p className="text-xl font-semibold">{dashData.doctors}</p>
              <p className="text-gray-500">Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-3 bg-white p-4 min-w-52 border rounded hover:scale-105 transition-all shadow-md">
            <img src={assets.appointments_icon} className="w-14" alt="Appointments icon" />
            <div>
              <p className="text-xl font-semibold">{dashData.appointments}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-3 bg-white p-4 min-w-52 border rounded hover:scale-105 transition-all shadow-md">
            <img src={assets.patients_icon} className="w-14" alt="Patients icon" />
            <div>
              <p className="text-xl font-semibold">{dashData.patients}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* === Latest Bookings Section === */}
        <div className="bg-white mt-10 max-w-2xl mx-auto md:mx-0 border rounded shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b">
            <img src={assets.list_icon} className="w-6 h-6" alt="List icon" />
            <p className="font-bold text-lg text-gray-800">Latest Bookings</p>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Map over the latest 5 appointments */}
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50 transition-colors"
                key={index}
              >
                {/* Doctor Image */}
                <img
                  src={item.docData.image || assets.default_doctor}
                  className="w-10 h-10 rounded-full object-cover border"
                  alt="Doctor profile"
                />

                {/* Booking Info */}
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-gray-800">{item.docData.name || "Unknown Doctor"}</p>
                  <p className="text-gray-600">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* Status / Action */}
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-bold bg-red-100 p-1 rounded">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-600 text-xs font-bold bg-green-100 p-1 rounded">Completed</p>
                ) : (
                  // Cancel button for pending appointments
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    src={assets.cancel_icon}
                    className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                    alt="Cancel appointment"
                    title="Cancel Appointment"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;