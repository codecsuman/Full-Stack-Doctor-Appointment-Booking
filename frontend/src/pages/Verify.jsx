import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const appointmentId = searchParams.get("appointmentId");

    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/verifyStripe",
                { success, appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message || "Payment verified successfully! 🎉");
            } else {
                toast.error(data.message || "Payment verification failed.");
            }

            // Always navigate regardless of success/failure after showing toast
            setTimeout(() => {
                navigate("/my-appointments");
            }, 500); // Small delay to ensure toast is visible

        } catch (error) {
            toast.error(error.message || "An unexpected error occurred during verification.");
            setTimeout(() => {
                navigate("/my-appointments");
            }, 500);
        }
    };

    // Only run verification once token, appointmentId, and success status are present
    useEffect(() => {
        if (token && appointmentId && success !== null) {
            verifyStripe();
        }
    }, [token, appointmentId, success]);

    return (
        // Enhanced Styling: Full viewport height, clean background
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl">

                {/* Enhanced Spinner: Thicker border, primary color */}
                <div className="w-16 h-16 border-6 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>

                {/* Contextual Loading Message */}
                <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Verifying Payment...
                </h1>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                    Please wait while we confirm your appointment details. Do not close this window.
                </p>
            </div>
        </div>
    );
};

export default Verify;