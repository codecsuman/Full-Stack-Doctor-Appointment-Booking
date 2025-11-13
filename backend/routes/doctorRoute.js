import express from "express";
import {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorList,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    changeAvailablity
} from "../controllers/doctorController.js";

import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

// Doctor Login
doctorRouter.post("/login", loginDoctor);

// Doctor Appointments (protected)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

// Doctor Profile (protected)
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// Doctor Dashboard
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

// Public Route — list doctors for frontend
doctorRouter.get("/list", doctorList);

// Toggle Availability
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);

export default doctorRouter;
