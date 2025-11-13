import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ success: true, token });
    } catch (error) {
        console.error("registerUser:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Missing credentials" });
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ success: true, token });
    } catch (error) {
        console.error("loginUser:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Get profile (uses req.userId from auth middleware)
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.json({ success: false, message: "Unauthorized" });

        const userData = await userModel.findById(userId).select("-password");
        return res.json({ success: true, userData });
    } catch (error) {
        console.error("getProfile:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Update profile (multipart/form-data, optional image)
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.json({ success: false, message: "Unauthorized" });

        // Fields from form-data (address might be a JSON string)
        let { name, phone, address, dob, gender } = req.body;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // Parse address safely (client sends JSON string)
        if (typeof address === "string") {
            try {
                address = JSON.parse(address);
            } catch (err) {
                address = { line1: "", line2: "" };
            }
        } else if (!address) {
            address = { line1: "", line2: "" };
        }

        // Update basic fields
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address,
            dob,
            gender,
        });

        // If image uploaded, upload to Cloudinary and update
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            if (imageUpload?.secure_url) {
                await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
            }
        }

        return res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error("updateProfile:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.json({ success: false, message: "Unauthorized" });

        const { docId, slotDate, slotTime } = req.body;
        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Missing data" });
        }

        const docData = await doctorModel.findById(docId).select("-password");
        if (!docData) return res.json({ success: false, message: "Doctor not found" });
        if (!docData.available) return res.json({ success: false, message: "Doctor Not Available" });

        // ensure slots_booked exists
        const slots_booked = docData.slots_booked || {};

        // check availability
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot Not Available" });
        }

        // add slot
        if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);

        // get user data
        const userData = await userModel.findById(userId).select("-password");

        // prepare docData snapshot to store in appointment (avoid storing slots_booked)
        const docSnapshot = docData.toObject();
        delete docSnapshot.slots_booked;
        delete docSnapshot.password;

        const appointmentData = {
            userId,
            docId,
            userData: userData.toObject(),
            docData: docSnapshot,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        return res.json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        console.error("bookAppointment:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.json({ success: false, message: "Unauthorized" });

        const { appointmentId } = req.body;
        if (!appointmentId) return res.json({ success: false, message: "Missing appointmentId" });

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // mark cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // release slot in doctor's record
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (doctorData) {
            const slots_booked = doctorData.slots_booked || {};
            slots_booked[slotDate] = (slots_booked[slotDate] || []).filter((e) => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        return res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.error("cancelAppointment:", error);
        return res.json({ success: false, message: error.message });
    }
};

// List user appointments
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.json({ success: false, message: "Unauthorized" });

        const appointments = await appointmentModel.find({ userId });
        return res.json({ success: true, appointments });
    } catch (error) {
        console.error("listAppointment:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Razorpay: create order
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) return res.json({ success: false, message: "Missing appointmentId" });

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        const order = await razorpayInstance.orders.create(options);
        return res.json({ success: true, order });
    } catch (error) {
        console.error("paymentRazorpay:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Razorpay: verify payment (expects razorpay_order_id, razorpay_payment_id, razorpay_signature)
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Missing razorpay fields" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // receipt contains appointmentId
            const appointmentId = razorpay_order_id;
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        } else {
            return res.json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("verifyRazorpay:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Stripe: create checkout session
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) return res.json({ success: false, message: "Missing appointmentId" });

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
        const currency = (process.env.CURRENCY || "INR").toLowerCase();

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: "Appointment Fees" },
                        unit_amount: appointmentData.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
        });

        return res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("paymentStripe:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Stripe verify (frontend redirects to /verify, backend is called to set payment)
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;
        if (success === "true" || success === true) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        }
        return res.json({ success: false, message: "Payment Failed" });
    } catch (error) {
        console.error("verifyStripe:", error);
        return res.json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    cancelAppointment,
    listAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
};
