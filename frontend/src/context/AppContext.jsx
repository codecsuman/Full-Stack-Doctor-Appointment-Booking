import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currency = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);

    // ------------------------------------
    // AXIOS INSTANCE (auto adds token)
    // ------------------------------------
    const axiosInstance = axios.create({
        baseURL: backendUrl,
    });

    axiosInstance.interceptors.request.use((config) => {
        if (token) config.headers.token = token;
        return config;
    });

    // ------------------------------------
    // GET ALL DOCTORS
    // ------------------------------------
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load doctors");
        }
    };

    // ------------------------------------
    // LOAD USER PROFILE
    // ------------------------------------
    const loadUserProfile = async () => {
        if (!token) return;

        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { token },
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
        }
    };

    // ------------------------------------
    // LOAD USER APPOINTMENTS
    // ------------------------------------
    const loadAppointments = async () => {
        if (!token) return;

        try {
            const { data } = await axiosInstance.get("/api/user/appointments");
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error("Appointments error:", error);
        }
    };

    // ------------------------------------
    // MOCK PAYMENT (SUCCESS)
    // ------------------------------------
    const makeMockPayment = async (appointmentId, amount) => {
        try {
            const { data } = await axiosInstance.post("/api/payment/mock", {
                appointmentId,
                amount,
            });

            if (data.success) {
                toast.success("Payment Successful!");
                loadAppointments();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Payment failed");
            return false;
        }
    };

    // ------------------------------------
    // LOAD DOCTORS ON FIRST RENDER
    // ------------------------------------
    useEffect(() => {
        getDoctorsData();
    }, []);

    // ------------------------------------
    // LOAD PROFILE + APPOINTMENTS WHEN TOKEN CHANGES
    // ------------------------------------
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            loadUserProfile();
            loadAppointments();
        } else {
            localStorage.removeItem("token");
            setUserData(null);
            setAppointments([]);
        }
    }, [token]);

    // ------------------------------------
    // CONTEXT VALUE
    // ------------------------------------
    const value = {
        backendUrl,
        currency,
        token,
        setToken,
        doctors,
        userData,
        appointments,

        axiosInstance,
        getDoctorsData,
        loadUserProfile,
        loadAppointments,
        makeMockPayment,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
