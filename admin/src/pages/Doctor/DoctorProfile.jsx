import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
    // Context Data
    const { dToken, profileData, setProfileData, getProfileData } =
        useContext(DoctorContext);

    const { currency, backendUrl } = useContext(AppContext);

    // State for toggling edit mode
    const [isEdit, setIsEdit] = useState(false);

    /**
     * Handles updating the doctor's profile on the backend.
     */
    const updateProfile = async () => {
        try {
            // Data fields that can be updated
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
            };

            const { data } = await axios.post(
                backendUrl + "/api/doctor/update-profile",
                updateData,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success("Profile Updated");
                setIsEdit(false);
                // Re-fetch profile data to confirm update
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update profile.");
            console.log("Profile Update Error:", error);
        }
    };

    // Effect to fetch initial profile data
    useEffect(() => {
        if (dToken) getProfileData();
    }, [dToken]);

    return (
        profileData && (
            <div className="m-5">
                <div className="flex flex-col gap-5 max-w-4xl mx-auto">

                    {/* Doctor Image and main info container */}
                    <div className="flex flex-col sm:flex-row gap-5">

                        {/* Image */}
                        <img
                            className="bg-primary/80 w-full sm:max-w-64 h-64 object-cover rounded-lg shadow-md"
                            src={profileData.image}
                            alt={`${profileData.name}'s profile`}
                        />

                        {/* Profile Details Card */}
                        <div className="flex-1 bg-white border rounded-lg p-6 shadow-lg">
                            {/* Name */}
                            <p className="text-3xl font-bold text-gray-800">
                                {profileData.name}
                            </p>

                            {/* Credentials */}
                            <div className="flex items-center gap-2 mt-1 text-gray-600 mb-4">
                                <p>
                                    {profileData.degree} - {profileData.speciality}
                                </p>
                                <span className="py-0.5 px-3 border border-gray-400 text-xs rounded-full font-medium bg-gray-100">
                                    {profileData.experience} Years Exp.
                                </span>
                            </div>

                            {/* About Section */}
                            <div className="mt-4 border-t pt-4">
                                <p className="font-semibold text-lg text-gray-700">About Me:</p>
                                {isEdit ? (
                                    <textarea
                                        rows={6}
                                        className="w-full border p-2 mt-1 rounded focus:ring focus:ring-blue-300"
                                        value={profileData.about}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({
                                                ...prev,
                                                about: e.target.value,
                                            }))
                                        }
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                                        {profileData.about}
                                    </p>
                                )}
                            </div>

                            {/* Fees */}
                            <p className="mt-4 text-gray-700 font-semibold">
                                Appointment Fee:{" "}
                                {isEdit ? (
                                    <span className="inline-flex items-center">
                                        {currency}
                                        <input
                                            type="number"
                                            className="border p-1 ml-1 w-24 rounded"
                                            value={profileData.fees}
                                            onChange={(e) =>
                                                setProfileData((prev) => ({
                                                    ...prev,
                                                    fees: e.target.value,
                                                }))
                                            }
                                        />
                                    </span>
                                ) : (
                                    <span className="text-gray-900 font-bold">
                                        {currency} {profileData.fees}
                                    </span>
                                )}
                            </p>

                            {/* Address */}
                            <div className="mt-4 text-gray-700">
                                <p className="font-semibold">Clinic Address:</p>
                                {isEdit ? (
                                    <div className="mt-1 space-y-2">
                                        <input
                                            type="text"
                                            className="border p-2 w-full rounded"
                                            placeholder="Address Line 1"
                                            value={profileData.address.line1}
                                            onChange={(e) =>
                                                setProfileData((prev) => ({
                                                    ...prev,
                                                    address: {
                                                        ...prev.address,
                                                        line1: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                        <input
                                            type="text"
                                            className="border p-2 w-full rounded"
                                            placeholder="Address Line 2 (City, State, Zip)"
                                            value={profileData.address.line2}
                                            onChange={(e) =>
                                                setProfileData((prev) => ({
                                                    ...prev,
                                                    address: {
                                                        ...prev.address,
                                                        line2: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm mt-1 text-gray-600">
                                        {profileData.address.line1}
                                        <br />
                                        {profileData.address.line2}
                                    </p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="flex items-center gap-2 mt-4 text-gray-700 font-semibold">
                                <p>Availability Status:</p>
                                <input
                                    type="checkbox"
                                    checked={profileData.available}
                                    onChange={() =>
                                        isEdit && // Only allow change if in edit mode
                                        setProfileData((prev) => ({
                                            ...prev,
                                            available: !prev.available,
                                        }))
                                    }
                                    // Disable checkbox if not in edit mode
                                    disabled={!isEdit}
                                    className={`w-4 h-4 rounded ${isEdit ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                                />
                                <label className={`text-sm ${profileData.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {profileData.available ? 'Available' : 'Unavailable'}
                                </label>
                            </div>

                            {/* Action Buttons */}
                            {isEdit ? (
                                <button
                                    onClick={updateProfile}
                                    className="px-6 py-2 mt-6 bg-blue-600 text-white font-semibold rounded-full 
                                                hover:bg-blue-700 transition duration-300 shadow-md"
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="px-6 py-2 mt-6 border border-blue-600 text-blue-600 font-semibold rounded-full 
                                                hover:bg-blue-100 transition duration-300 shadow-md"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default DoctorProfile;