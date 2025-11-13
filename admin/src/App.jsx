import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { DoctorContext } from "./context/DoctorContext";
import { AdminContext } from "./context/AdminContext";

// Shared Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

import Login from "./pages/Login";

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const isAuthenticated = !!aToken || !!dToken;

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* ====================== UNAUTHENTICATED ====================== */}
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          {/* ====================== AUTHENTICATED LAYOUT ====================== */}
          <Navbar />
          <div className="flex items-start">
            <Sidebar />
            <Routes>
              {/* -------------- Admin Routes -------------- */}
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllAppointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<DoctorsList />} />

              {/* -------------- Doctor Routes -------------- */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
