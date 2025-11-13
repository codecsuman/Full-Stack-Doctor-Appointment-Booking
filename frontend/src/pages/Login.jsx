import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint =
        state === "Sign Up"
          ? "/api/user/register"
          : "/api/user/login";

      const body =
        state === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(backendUrl + endpoint, body);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(
          state === "Sign Up"
            ? "Account created successfully! Redirecting..."
            : "Login successful! Redirecting..."
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    // 1. Goo Level Background: Ensures the form is centered on a full-height, slightly colored background for visual appeal.
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md"
      >
        {/* 2. Enhanced Card Styling: Added better padding, darker border, and a deeper shadow for a premium feel. */}
        <div className="flex flex-col gap-5 m-auto items-center p-8 sm:p-10 bg-white border border-gray-200 rounded-2xl text-gray-700 text-base shadow-2xl transition-all duration-500 hover:shadow-primary/20">

          {/* Header/Title */}
          <p className="text-3xl font-extrabold text-gray-900 mb-2 w-full text-left">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </p>
          <p className="text-sm text-gray-500 w-full text-left">
            Please {state === "Sign Up" ? "sign up" : "log in"} to book your appointment.
          </p>

          {/* Full Name Input (Only visible for Sign Up) */}
          {state === "Sign Up" && (
            <div className="w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* 3. Enhanced CTA Button: Strong hover and active effects */}
          <button
            type="submit"
            className="bg-primary text-white w-full py-3 mt-3 rounded-xl text-lg font-bold shadow-lg shadow-primary/30 
                       hover:bg-primary-dark hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] 
                       transition-all duration-300 ease-in-out"
          >
            {state === "Sign Up" ? "Create Account" : "Login Securely"}
          </button>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 mt-2">
            {state === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState("Login")}
                  className="text-primary font-bold cursor-pointer hover:underline transition-colors"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-primary font-bold cursor-pointer hover:underline transition-colors"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>

        </div>
      </form>
    </div>
  );
};

export default Login;