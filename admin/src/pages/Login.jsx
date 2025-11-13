import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  // State to toggle between Admin and Doctor login
  const [state, setState] = useState("Admin");

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Get backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Context functions to set tokens globally
  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  /**
   * Handles the form submission, performs the login API call,
   * and stores the authentication token.
   */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Determine the correct API endpoint based on the current state (Admin or Doctor)
      let url =
        state === "Admin"
          ? "/api/admin/login"
          : "/api/doctor/login";

      // API call to the backend
      const { data } = await axios.post(
        backendUrl + url,
        { email, password }
      );

      // Check for backend-reported failure
      if (!data.success) return toast.error(data.message);

      // If successful, set the token in context and local storage
      if (state === "Admin") {
        setAToken(data.token);
        localStorage.setItem("aToken", data.token);
      } else {
        setDToken(data.token);
        localStorage.setItem("dToken", data.token);
      }

      toast.success(`Login successful as ${state}!`);
    } catch (err) {
      // Handle network or request errors
      toast.error(err.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white px-8 py-8 rounded-xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {state}{" "}
          <span className="text-primary font-light">Login</span>
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-primary focus:border-primary transition"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-primary focus:border-primary transition"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-2 text-lg font-semibold 
                     hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Log In
        </button>

        {/* Toggle Login State */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          {state === "Admin" ? (
            <>
              Logging in as a Doctor?{" "}
              <span
                className="text-blue-600 font-medium cursor-pointer underline hover:text-blue-800 transition"
                onClick={() => {
                  setState("Doctor");
                  setEmail("");
                  setPassword("");
                }}
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Logging in as an Admin?{" "}
              <span
                className="text-blue-600 font-medium cursor-pointer underline hover:text-blue-800 transition"
                onClick={() => {
                  setState("Admin");
                  setEmail("");
                  setPassword("");
                }}
              >
                Click here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;