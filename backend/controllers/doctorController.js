import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.json({ success: false, message: "Missing credentials" });

        const user = await doctorModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ success: true, token });
    } catch (error) {
        console.error("loginDoctor:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Get appointments for doctor (authDoctor should set req.docId)
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;
        if (!docId) return res.json({ success: false, message: "Unauthorized" });

        const appointments = await appointmentModel.find({ docId });
        return res.json({ success: true, appointments });
    } catch (error) {
        console.error("appointmentsDoctor:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Doctor cancel appointment (only if belongs to doctor)
const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;
        if (!docId) return res.json({ success: false, message: "Unauthorized" });

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

        if (String(appointmentData.docId) !== String(docId)) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        return res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.error("doctor appointmentCancel:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Mark appointment completed (doctor)
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;
        if (!docId) return res.json({ success: false, message: "Unauthorized" });

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

        if (String(appointmentData.docId) !== String(docId)) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        return res.json({ success: true, message: "Appointment Completed" });
    } catch (error) {
        console.error("appointmentComplete:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Public doctor list for frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        return res.json({ success: true, doctors });
    } catch (error) {
        console.error("doctorList:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Toggle availability (doctor or admin)
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;
        if (!docId) return res.json({ success: false, message: "Missing docId" });

        const doc = await doctorModel.findById(docId);
        if (!doc) return res.json({ success: false, message: "Doctor not found" });

        await doctorModel.findByIdAndUpdate(docId, { available: !doc.available });
        return res.json({ success: true, message: "Availability Changed" });
    } catch (error) {
        console.error("changeAvailablity:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Doctor profile (for doctor panel) - uses req.docId
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId || req.body.docId;
        if (!docId) return res.json({ success: false, message: "Missing docId" });

        const profileData = await doctorModel.findById(docId).select("-password");
        return res.json({ success: true, profileData });
    } catch (error) {
        console.error("doctorProfile:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Update doctor profile (doctor panel)
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId || req.body.docId;
        if (!docId) return res.json({ success: false, message: "Missing docId" });

        const { fees, address, available } = req.body;
        let addressParsed = address;
        if (typeof address === "string") {
            try {
                addressParsed = JSON.parse(address);
            } catch (err) {
                addressParsed = addressParsed || {};
            }
        }

        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address: addressParsed,
            available,
        });

        return res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error("updateDoctorProfile:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Doctor dashboard
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId || req.body.docId;
        if (!docId) return res.json({ success: false, message: "Missing docId" });

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        const patientsSet = new Set();

        for (const item of appointments) {
            if (item.isCompleted || item.payment) earnings += item.amount;
            if (item.userId) patientsSet.add(String(item.userId));
        }

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patientsSet.size,
            latestAppointments: appointments.reverse(),
        };

        return res.json({ success: true, dashData });
    } catch (error) {
        console.error("doctorDashboard:", error);
        return res.json({ success: false, message: error.message });
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
};
