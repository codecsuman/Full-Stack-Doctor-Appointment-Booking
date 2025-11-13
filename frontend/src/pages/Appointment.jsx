import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();

    const {
        doctors,
        backendUrl,
        token,
        currency,
        getDoctorsData,
    } = useContext(AppContext);

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState("");

    // -----------------------------
    // LOAD DOCTOR DETAILS (Logic unchanged)
    // -----------------------------
    useEffect(() => {
        if (doctors.length > 0) {
            const doctor = doctors.find((doc) => doc._id === docId);
            setDocInfo(doctor);
        }
    }, [doctors, docId]);

    // -----------------------------
    // GENERATE TIME SLOTS (Logic unchanged)
    // -----------------------------
    const getAvailableSlots = () => {
        if (!docInfo) return;

        const booked = docInfo.slots_booked || {};
        const result = [];

        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const current = new Date(today);
            current.setDate(today.getDate() + i);

            const end = new Date(current);
            end.setHours(21, 0, 0, 0);

            // Set start time for today (current hour + 1, rounded to nearest half-hour)
            if (i === 0) {
                current.setHours(Math.max(current.getHours() + 1, 10));
                current.setMinutes(current.getMinutes() > 30 ? 30 : 0);
            } else {
                // Set start time for future days
                current.setHours(10, 0, 0, 0);
            }

            const slots = [];
            while (current < end) {
                const time = current.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                const dateKey = `${current.getDate()}_${current.getMonth() + 1}_${current.getFullYear()}`;
                const isAvailable =
                    !booked[dateKey] || !booked[dateKey].includes(time);

                if (isAvailable) {
                    slots.push({
                        datetime: new Date(current),
                        time,
                    });
                }

                current.setMinutes(current.getMinutes() + 30);
            }

            // Only push the slot group if there are slots available for that day
            if (slots.length > 0) {
                result.push(slots);
            }
        }

        setDocSlots(result);
        // Reset slotIndex to 0 if slots are generated, ensuring the first day is selected
        if (result.length > 0) {
            setSlotIndex(0);
            setSlotTime(''); // Clear selected time when dates change
        }
    };

    useEffect(() => {
        getAvailableSlots();
    }, [docInfo]);

    // -----------------------------
    // BOOK APPOINTMENT (Logic unchanged)
    // -----------------------------
    const bookAppointment = async () => {
        if (!token) {
            toast.warning("Please login first");
            return navigate("/login");
        }

        if (docSlots.length === 0 || !docSlots[slotIndex] || !slotTime) {
            toast.error("Please select an available date and time slot.");
            return;
        }

        // Ensure the selected slot is valid and exists in the current array
        const selectedSlotGroup = docSlots[slotIndex];
        const selectedSlot = selectedSlotGroup.find(slot => slot.time === slotTime);

        if (!selectedSlot) {
            toast.error("Selected slot is no longer available or invalid.");
            return;
        }

        const dateObj = selectedSlot.datetime;
        const slotDate = `${dateObj.getDate()}_${dateObj.getMonth() + 1}_${dateObj.getFullYear()}`;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success("Appointment booked successfully");
                getDoctorsData();
                navigate("/my-appointments");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred during booking. Please try again.");
        }
    };

    if (!docInfo) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ---------- Doctor Details Card ----------- */}
            <div className="flex flex-col sm:flex-row gap-6 relative shadow-xl rounded-xl p-4 bg-white">

                {/* Doctor Image */}
                <div className="w-full sm:max-w-72 sm:w-1/3 flex-shrink-0">
                    <img
                        className="bg-primary w-full h-full object-cover rounded-xl shadow-lg"
                        src={docInfo.image}
                        alt={`Dr. ${docInfo.name}`}
                    />
                </div>

                {/* Doctor Info Panel */}
                <div className="flex-1 rounded-lg p-6 sm:p-8 bg-white border border-gray-100 -mt-20 sm:mt-0 shadow-lg sm:shadow-none">
                    <p className="flex items-center gap-3 text-4xl font-extrabold text-gray-800">
                        {docInfo.name}
                        <img className="w-6" src={assets.verified_icon} alt="Verified" />
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-primary font-medium">
                        <p className="text-xl">
                            {docInfo.degree} - <span className="font-semibold">{docInfo.speciality}</span>
                        </p>
                        <span className="py-1 px-3 border border-primary text-xs rounded-full bg-primary/10 font-bold">
                            {docInfo.experience}
                        </span>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <p className="flex items-center gap-1 text-base font-semibold text-gray-700">
                            About <img className="w-4" src={assets.info_icon} alt="Info" />
                        </p>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed italic">
                            {docInfo.about}
                        </p>
                    </div>

                    <p className="text-xl font-bold mt-6 text-gray-700">
                        Appointment Fee:{" "}
                        <span className="text-primary ml-1 text-2xl">
                            {currency}{docInfo.fees}
                        </span>
                    </p>
                </div>
            </div>

            {/* ---------- Slots Selection ---------- */}
            <div className="sm:ml-72 sm:pl-4 mt-12 font-semibold text-gray-700">
                <h2 className="text-2xl mb-6 border-b pb-3">
                    <span className="text-primary font-extrabold">Select</span> Your Booking Slot
                </h2>

                {/* DAYS */}
                <p className="mb-3 text-lg">Available Dates:</p>
                {docSlots.length > 0 ? (
                    <div className="flex gap-4 overflow-x-scroll pb-4">
                        {docSlots.map((slotGroup, index) => {
                            // Safely get the date object
                            const dateObj = slotGroup[0]?.datetime;
                            if (!dateObj) return null; // Should not happen with the improved logic

                            return (
                                // Date Selector Button with Hover Effect
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSlotIndex(index);
                                        setSlotTime(""); // Clear time selection when date changes
                                    }}
                                    className={`
                                        text-center 
                                        py-4 px-6 
                                        min-w-[75px] 
                                        rounded-xl 
                                        cursor-pointer 
                                        transition-all 
                                        duration-300 
                                        shadow-md
                                        ${index === slotIndex
                                            ? "bg-primary text-white scale-105 shadow-xl font-bold"
                                            : "border border-gray-300 bg-gray-50 text-gray-600 hover:border-primary hover:bg-primary/10"
                                        }
                                    `}
                                >
                                    <p className="text-lg">{dateObj.getDate()}</p>
                                    <p className="text-xs font-medium mt-1">{daysOfWeek[dateObj.getDay()]}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 italic mt-4">No available dates for the next 7 days.</p>
                )}


                {/* SPECIFIC TIMES */}
                <p className="mt-8 mb-3 text-lg">Available Times:</p>
                <div className="flex flex-wrap gap-3 mt-4 max-w-full">
                    {/* Ensure docSlots[slotIndex] exists before mapping */}
                    {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
                        docSlots[slotIndex].map((slot, i) => (
                            // Time Slot Button with Beautiful Hover Effect
                            <p
                                key={i}
                                onClick={() => setSlotTime(slot.time)}
                                className={`
                                    text-sm 
                                    font-medium 
                                    px-5 py-2 
                                    rounded-full 
                                    cursor-pointer 
                                    transition-all 
                                    duration-200
                                    shadow-sm
                                    ${slot.time === slotTime
                                        ? "bg-primary text-white shadow-lg scale-[1.05] font-semibold"
                                        : "text-gray-700 border border-gray-400 bg-white hover:bg-primary/20 hover:border-primary hover:scale-[1.03] hover:text-primary" // Added hover:text-primary
                                    }
                                `}
                            >
                                {slot.time.toLowerCase()}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500 italic mt-4">No available slots for this date.</p>
                    )}
                </div>

                {/* --- BOOK APPOINTMENT BUTTON with Beautiful Hover Effect --- */}
                <button
                    onClick={bookAppointment}
                    className="
                        bg-primary 
                        text-white 
                        text-lg 
                        font-bold 
                        px-12 py-4
                        rounded-full 
                        mt-10 mb-8
                        shadow-xl
                        
                        // Hover Effects
                        hover:bg-primary-dark // Use a proper dark variant if defined in Tailwind config
                        hover:shadow-2xl 
                        hover:scale-[1.02] 
                        active:scale-[0.98] 
                        transition-all 
                        duration-300 
                        ease-in-out
                        min-w-[280px]
                    "
                >
                    Book an appointment
                </button>
            </div>

            {/* --- Related Doctors Section --- */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    );
};

export default Appointment;