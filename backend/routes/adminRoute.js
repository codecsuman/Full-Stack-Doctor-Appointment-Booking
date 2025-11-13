import express from "express";
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard
} from "../controllers/adminController.js";

import { changeAvailablity } from "../controllers/doctorController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

// Admin Login
adminRouter.post("/login", loginAdmin);

// Add Doctor
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

// Appointments Management
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

// Doctors List
adminRouter.get("/all-doctors", authAdmin, allDoctors);

// Change Doctor Availability
adminRouter.post("/change-availability", authAdmin, changeAvailablity);

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
