import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";

// =======================================
// Admin Login
// =======================================
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Secure token with role
            const token = jwt.sign(
                {
                    role: "admin",
                    email: process.env.ADMIN_EMAIL,
                },
                process.env.JWT_SECRET
            );

            return res.json({ success: true, token });
        }

        return res.json({ success: false, message: "Invalid credentials" });
    } catch (error) {
        console.error("loginAdmin:", error);
        return res.json({ success: false, message: error.message });
    }
};

// =======================================
// Get All Appointments
// =======================================
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("appointmentsAdmin:", error);
        res.json({ success: false, message: error.message });
    }
};

// =======================================
// Cancel Appointment (Admin)
// =======================================
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.error("appointmentCancel:", error);
        res.json({ success: false, message: error.message });
    }
};

// =======================================
// Add Doctor
// =======================================
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;

        const imageFile = req.file;

        // Validate fields
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address
        ) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email Format" });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload Image
        const imgUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });
        const imageUrl = imgUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added Successfully" });
    } catch (error) {
        console.error("addDoctor:", error);
        res.json({ success: false, message: error.message });
    }
};

// =======================================
// Get All Doctors For Admin
// =======================================
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("allDoctors:", error);
        res.json({ success: false, message: error.message });
    }
};

// =======================================
// Admin Dashboard
// =======================================
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            patients: users.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse(),
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("adminDashboard:", error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
};
