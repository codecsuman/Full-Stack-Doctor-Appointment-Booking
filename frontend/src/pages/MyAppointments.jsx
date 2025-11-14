import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // Assumed assets structure

const MyAppointments = () => {
    // Assume currency is provided by AppContext
    const { backendUrl, token, currency } = useContext(AppContext);
    const navigate = useNavigate();

    // State management
    const [appointments, setAppointments] = useState([]);
    const [payment, setPayment] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Helper function to format the date for display
    const slotDateFormat = (slotDate) => {
        const d = slotDate.split("_");
        // Ensure month conversion is safe
        const monthIndex = Number(d[1]) - 1;
        const monthName = months[monthIndex] || '';
        return `${d[0]} ${monthName} ${d[2]}`;
    };

    // API Call: Fetch user's appointments
    const getUserAppointments = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/appointments",
                { headers: { token } }
            );
            if (data.success) setAppointments(data.appointments.reverse());
        } catch (error) {
            toast.error("Failed to load appointments.");
        } finally {
            setIsLoading(false);
        }
    };

    // API Call: Cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/cancel-appointment",
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success("Appointment successfully cancelled.");
                getUserAppointments();
            } else toast.error(data.message);
        } catch (error) {
            toast.error("Error cancelling appointment.");
        }
    };

    // --- Payment Logic (Kept simple as implementation was complex) ---

    // Razorpay initialization function (Assumed external script loaded)
    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Appointment Payment",
            description: "Appointment Payment",
            order_id: order.id,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        backendUrl + "/api/user/verifyRazorpay",
                        response,
                        { headers: { token } }
                    );
                    if (data.success) {
                        toast.success("Payment successful");
                        getUserAppointments();
                    }
                } catch (error) {
                    toast.error("Payment verification failed.");
                }
            },
        };
        new window.Razorpay(options).open();
    };

    // API Call: Initiate Razorpay order
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/payment-razorpay",
                { appointmentId },
                { headers: { token } }
            );
            if (data.success) initPay(data.order);
        } catch (error) {
            toast.error("Error initiating Razorpay.");
        }
    };

    // API Call: Initiate Stripe checkout
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/payment-stripe",
                { appointmentId },
                { headers: { token } }
            );
            if (data.success) window.location.replace(data.session_url);
        } catch (error) {
            toast.error("Error initiating Stripe.");
        }
    };

    // --- Effects ---

    useEffect(() => {
        if (token) {
            getUserAppointments();
        } else {
            // Redirect unauthenticated users
            navigate("/login");
        }
    }, [token, navigate]);

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>
                <div className="p-8 text-center text-primary bg-white rounded-xl shadow-md">
                    <p className="animate-pulse font-medium">Loading appointments...</p>
                </div>
            </div>
        );
    }

    // --- No Appointments State ---
    if (appointments.length === 0 && !isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>
                <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                    <img src={assets.empty_box} alt="Empty appointments list" className="w-20 mx-auto mb-4 opacity-75" />
                    <p className="text-xl font-semibold text-gray-600">You haven't booked any appointments yet.</p>
                    <button
                        onClick={() => navigate("/doctors")}
                        className="mt-6 bg-primary text-white py-2 px-6 rounded-full font-medium hover:bg-primary-dark transition-all shadow-md"
                    >
                        Book Your First Appointment
                    </button>
                </div>
            </div>
        );
    }

    // --- Main Render: Appointment List ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

            <div className="flex flex-col gap-6">
                {appointments.map((item) => {
                    // Determine status for dynamic styling and badge text
                    let statusText = "Upcoming";
                    let statusClasses = "bg-primary text-white";

                    if (item.cancelled) {
                        statusText = "Cancelled";
                        statusClasses = "bg-red-100 text-red-600 border border-red-300";
                    } else if (item.isCompleted) {
                        statusText = "Completed";
                        statusClasses = "bg-green-100 text-green-600 border border-green-300";
                    } else if (item.payment) {
                        statusText = "Confirmed & Paid";
                        statusClasses = "bg-green-500 text-white";
                    }

                    return (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]"
                        >
                            {/* Doctor Image & Status Badge */}
                            {/* 💡 CHANGE: New styling for image container (Aspect ratio, shadow, padding) */}
                            <div className="w-full sm:w-1/4 flex-shrink-0 relative p-2 bg-white rounded-lg shadow-xl border border-gray-200">
                                <div className="relative aspect-video sm:aspect-square overflow-hidden rounded-md">
                                    <img
                                        className="w-full h-full object-cover" // Ensure object-cover and full dimensions
                                        src={item.docData.image}
                                        alt={`Dr. ${item.docData.name}`}
                                    />
                                </div>
                                <span className={`absolute top-4 right-4 z-10 px-3 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                                    {statusText}
                                </span>
                            </div>

                            {/* Appointment Info */}
                            <div className="flex-1 text-sm text-gray-600">
                                <p className="text-2xl text-gray-900 font-extrabold mb-1">
                                    Dr. {item.docData.name}
                                </p>
                                <p className="text-primary font-semibold mb-2">{item.docData.speciality}</p>

                                {/* Date & Time */}
                                <div className="flex items-center gap-2 text-base font-medium text-gray-700 mt-3">
                                    {/* Assuming assets.calendar_icon exists */}
                                    <img className="w-5" src={assets.calendar_icon} alt="Date" />
                                    <p>
                                        <span className="font-bold">{slotDateFormat(item.slotDate)}</span> at {item.slotTime}
                                    </p>
                                </div>

                                {/* Address */}
                                <div className="mt-3 text-sm text-gray-500">
                                    <p className="font-semibold text-gray-700">Clinic Address:</p>
                                    <p>{item.docData.address.line1}</p>
                                    <p>{item.docData.address.line2}</p>
                                </div>

                                {/* Fee */}
                                <p className="text-lg font-extrabold text-gray-800 mt-4">
                                    Fee: <span className="text-primary ml-1">{currency}{item.docData.fees}</span>
                                </p>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="sm:w-1/4 flex flex-col gap-3 justify-end text-sm text-center pt-4 sm:pt-0">

                                {!item.cancelled && !item.isCompleted ? (
                                    <>
                                        {/* State 1: Awaiting Payment */}
                                        {!item.payment && payment !== item._id && (
                                            <button
                                                onClick={() => setPayment(item._id)}
                                                className="bg-primary text-white font-bold py-2 rounded-lg shadow-md hover:bg-primary-dark transition-all"
                                            >
                                                Proceed to Payment
                                            </button>
                                        )}

                                        {/* State 2: Show Payment Options */}
                                        {payment === item._id && (
                                            <>
                                                <p className="text-xs font-medium text-gray-500">Choose Payment Method</p>
                                                <button
                                                    onClick={() => appointmentStripe(item._id)}
                                                    className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex justify-center items-center gap-2"
                                                >
                                                    <img className="max-w-16 h-5" src={assets.stripe_logo} alt="Pay with Stripe" />
                                                </button>

                                                <button
                                                    onClick={() => appointmentRazorpay(item._id)}
                                                    className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex justify-center items-center gap-2"
                                                >
                                                    <img className="max-w-20 h-5" src={assets.razorpay_logo} alt="Pay with Razorpay" />
                                                </button>

                                                <button
                                                    onClick={() => setPayment("")}
                                                    className="text-xs text-gray-500 hover:text-red-500 mt-1"
                                                >
                                                    Cancel Payment Selection
                                                </button>
                                            </>
                                        )}

                                        {/* Cancel Button (Always present if not cancelled/completed) */}
                                        {payment !== item._id && (
                                            <button
                                                onClick={() => cancelAppointment(item._id)}
                                                className="py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all mt-2"
                                            >
                                                Cancel Appointment
                                            </button>
                                        )}

                                    </>
                                ) : (
                                    // State 3 & 4: Status Message (Final state - Paid/Cancelled/Completed)
                                    <button
                                        className={`py-2 rounded-lg font-bold shadow-md cursor-default 
                                        ${item.isCompleted ? "bg-green-500 text-white" : "bg-red-500/10 text-red-700 border border-red-200"}`}
                                    >
                                        {item.isCompleted ? "Appointment Finished" : "Status: Cancelled"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyAppointments;