import { createContext, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// 1. Export the context
export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
    // Environment variable setup
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 2. State Management
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New: Loading state for UX

    // 3. Memoize headers
    const headers = useMemo(() => ({ dToken }), [dToken]);

    // 4. Centralized Error Handler (structural cleanup)
    const handleApiError = useCallback((e, customMessage = "An unknown error occurred.") => {
        // Log the full error for internal debugging
        console.error("Doctor API Error:", e);

        // Use the server-provided message, fallback to axios message, or use custom message
        const message = e.response?.data?.message || e.message || customMessage;

        toast.error(message);
    }, []);

    /* --- API CALLS: Wrapped in useCallback for performance and dependency control --- */

    // 5. Fetch Dashboard Data
    const getDashData = useCallback(async () => {
        if (!dToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/dashboard`,
                { headers }
            );
            if (data.success) setDashData(data.dashData);
        } catch (e) {
            handleApiError(e, "Failed to load dashboard statistics.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, dToken, handleApiError]);

    // 6. Fetch Appointments
    const getAppointments = useCallback(async () => {
        if (!dToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/appointments`,
                { headers }
            );
            // Reverse locally if required, otherwise let backend handle order
            if (data.success) setAppointments(data.appointments.reverse());
        } catch (e) {
            handleApiError(e, "Failed to fetch appointment list.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, dToken, handleApiError]);

    // 7. Fetch Profile Data
    const getProfileData = useCallback(async () => {
        if (!dToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/profile`,
                { headers }
            );
            if (data.success) setProfileData(data.profileData);
        } catch (e) {
            handleApiError(e, "Failed to fetch doctor profile.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, dToken, handleApiError]);

    // 8. Cancel Appointment
    const cancelAppointment = useCallback(async (id) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId: id },
                { headers }
            );
            if (data.success) toast.success("Appointment cancelled successfully.");

            // Refresh data only if the API call was successful
            getAppointments();
            getDashData();
        } catch (e) {
            handleApiError(e, "Failed to cancel appointment.");
        }
    }, [backendUrl, headers, getAppointments, getDashData, handleApiError]);

    // 9. Complete Appointment
    const completeAppointment = useCallback(async (id) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId: id },
                { headers }
            );
            if (data.success) toast.success("Appointment marked as complete!");

            // Refresh data only if the API call was successful
            getAppointments();
            getDashData();
        } catch (e) {
            handleApiError(e, "Failed to complete appointment.");
        }
    }, [backendUrl, headers, getAppointments, getDashData, handleApiError]);

    // 10. Memoize the provided value for consumers
    const contextValue = useMemo(() => ({
        dToken,
        setDToken,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        isLoading, // Provide loading state
    }), [
        dToken,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        isLoading,
    ]);

    return (
        <DoctorContext.Provider value={contextValue}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;