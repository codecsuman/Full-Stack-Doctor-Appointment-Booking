import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Corrected import paths by assuming a flat structure relative to the component's entry point
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

// Reusable Input Field Component for clean structure
const InputField = ({ label, type = "text", value, onChange, placeholder, required = true }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            // Beautiful Input Styling: Rounded, shadow, focus ring
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
    </div>
);

// Reusable Select Field Component
const SelectField = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <select
            value={value}
            onChange={onChange}
            // Beautiful Select Styling: Same as input
            className="w-full p-3 border border-gray-300 bg-white rounded-lg shadow-sm transition-all duration-200 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const AddDoctor = () => {
    // State Initialization
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFees] = useState("");
    const [about, setAbout] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [degree, setDegree] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const experienceOptions = Array.from({ length: 10 }, (_, i) => `${i + 1} Year`);
    const specialityOptions = [
        "General physician", "Gynecologist", "Dermatologist",
        "Pediatricians", "Neurologist", "Gastroenterologist"
    ];

    const resetForm = () => {
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setAbout("");
        setSpeciality("General physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!docImg) return toast.error("Please upload doctor image.");
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("image", docImg);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("experience", experience);
            formData.append("fees", Number(fees));
            formData.append("about", about);
            formData.append("speciality", speciality);
            formData.append("degree", degree);
            formData.append(
                "address",
                JSON.stringify({ line1: address1, line2: address2 })
            );

            const { data } = await axios.post(
                `${backendUrl}/api/admin/add-doctor`,
                formData,
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success("Doctor Added Successfully");
                resetForm();
            } else {
                toast.error(data.message || "Failed to add doctor.");
            }
        } catch (error) {
            console.error("Add Doctor Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Network error occurred.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Doctor</h1>

            <form onSubmit={onSubmitHandler} className="bg-white rounded-xl shadow-2xl p-6 md:p-10">

                {/* Image Upload Area (Structural & Beautiful) */}
                <div className="mb-10 p-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary transition-colors duration-300">
                    <label htmlFor="doctor-image" className="flex items-center gap-6 cursor-pointer">
                        <img
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Doctor Upload Preview"
                            className="w-20 h-20 object-cover rounded-full shadow-lg transition-transform duration-300 hover:scale-105 bg-gray-50 border-2 border-white"
                        />
                        <div className="text-gray-600">
                            <p className="font-semibold text-lg text-primary">Click to Upload Doctor Picture</p>
                            <p className="text-sm">PNG, JPG, or GIF accepted (Max 5MB)</p>
                        </div>
                    </label>
                    <input
                        id="doctor-image"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setDocImg(e.target.files[0])}
                    />
                </div>

                {/* Main Form Fields (Structural Grid Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                    {/* Column 1 */}
                    <div className="space-y-6">
                        <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <SelectField
                            label="Experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            options={experienceOptions}
                        />
                        <InputField
                            label="Fees (per session)"
                            type="number"
                            value={fees}
                            onChange={(e) => setFees(e.target.value)}
                            placeholder="e.g., 500"
                        />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <SelectField
                            label="Speciality"
                            value={speciality}
                            onChange={(e) => setSpeciality(e.target.value)}
                            options={specialityOptions}
                        />
                        <InputField label="Degree / Qualifications" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., MBBS, MD, FRCS" />

                        {/* Address Group */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Clinic Address</label>
                            <input
                                type="text"
                                value={address1}
                                required
                                onChange={(e) => setAddress1(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="Address Line 1 (Street, Building)"
                            />
                            <input
                                type="text"
                                value={address2}
                                required
                                onChange={(e) => setAddress2(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none mt-2"
                                placeholder="Address Line 2 (City, State, Zip)"
                            />
                        </div>
                    </div>
                </div>

                {/* About Doctor */}
                <div className="mt-8">
                    <label htmlFor="about-doctor" className="text-sm font-semibold text-gray-700 mb-2 block">About Doctor</label>
                    <textarea
                        id="about-doctor"
                        rows={5}
                        required
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                   focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                        placeholder="Provide a detailed professional summary of the doctor, including areas of expertise and notable achievements."
                    ></textarea>
                </div>

                {/* Submit Button (Beautiful Hover Effect) */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    // Beautiful Button Styling: Primary color, bold, shadow, rounded, full transition
                    className="bg-primary hover:bg-primary-dark text-white font-bold mt-8 px-12 py-3 rounded-xl shadow-lg 
                               transition-all duration-300 ease-in-out w-full md:w-auto 
                               
                               /* Beautiful Hover Effect: Subtle Lift */
                               hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
                </button>
            </form>
        </div>
    );
};

export default AddDoctor;