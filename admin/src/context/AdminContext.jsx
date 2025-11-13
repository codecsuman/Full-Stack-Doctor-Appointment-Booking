import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// 1. Export the context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    // Environment variable setup (already good)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 2. State Management (already good)
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New: Loading state for UX

    // 3. Memoize headers (more efficient)
    const headers = useMemo(() => ({ aToken }), [aToken]);

    // 4. Centralized Error Handler (structural cleanup)
    const handleApiError = (e, customMessage) => {
        // Log the error for debugging (good practice)
        console.error("API Error:", e);

        // Use the server-provided message if available, otherwise use a fallback
        const message = e.response?.data?.message || customMessage || "An unknown error occurred.";

        toast.error(message);
    };

    /* --- API CALLS: Wrapped in useCallback for performance and dependency control --- */

    // 5. Fetch Doctors (added loading state)
    const getAllDoctors = useCallback(async () => {
        if (!aToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/all-doctors`,
                { headers }
            );
            if (data.success) setDoctors(data.doctors);
        } catch (e) {
            handleApiError(e, "Failed to fetch doctor list.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, aToken]);

    // 6. Change Doctor Availability
    const changeAvailability = useCallback(async (docId) => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                { headers }
            );
            if (data.success) {
                toast.success(data.message);
                // Call the memoized function to refresh data
                getAllDoctors();
            }
        } catch (e) {
            handleApiError(e, "Failed to change doctor availability.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, getAllDoctors]);

    // 7. Fetch All Appointments
    const getAllAppointments = useCallback(async () => {
        if (!aToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/appointments`,
                { headers }
            );
            // Reverse locally if needed, or better, handle sorting on the backend
            if (data.success) setAppointments(data.appointments.reverse());
        } catch (e) {
            handleApiError(e, "Failed to fetch appointments.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, aToken]);

    // 8. Cancel Appointment
    const cancelAppointment = useCallback(async (id) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId: id },
                { headers }
            );
            if (data.success) {
                toast.success("Appointment successfully cancelled.");
                getAllAppointments();
            }
        } catch (e) {
            handleApiError(e, "Failed to cancel appointment.");
        }
    }, [backendUrl, headers, getAllAppointments]);

    // 9. Fetch Dashboard Data
    const getDashData = useCallback(async () => {
        if (!aToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/dashboard`,
                { headers }
            );
            if (data.success) setDashData(data.dashData);
        } catch (e) {
            handleApiError(e, "Failed to load dashboard data.");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, headers, aToken]);

    // 10. Memoize the provided value for consumers
    const contextValue = useMemo(() => ({
        aToken,
        setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        dashData,
        getDashData,
        cancelAppointment,
        isLoading, // Provide loading state to the consumers
    }), [
        aToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        dashData,
        getDashData,
        cancelAppointment,
        isLoading,
    ]);

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;