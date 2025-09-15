import "../index.css"; // Tailwind CSS
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { ToastContainer, toast } from "react-toastify";
import { Sun, Moon } from "lucide-react";

function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const [loading, setLoading] = useState(false);

  // theme hook: { theme, setTheme } where theme: true = light, false = dark
  const { theme, setTheme } = useTheme();

  const handleError = (err) => toast.error(err, { position: "top-right" });
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" });

  const onSubmit = async (fdata) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/login",
        { ...fdata },
        { withCredentials: true }
      );
      const { success, message } = data || {};
      if (success) {
        const { role, user, subscribed, tenant_id } = data;
        handleSuccess(message);
        setAuth({ user, role, subscribed, tenant_id });
        reset();
        setTimeout(() => navigate(from, { replace: true }), 600);
      } else {
        handleError(message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleError(error?.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setTheme(!theme);

  return (
    <>
      <div
        className={`${
          theme ? "" : "dark"
        } min-h-screen pt-20 bg-[#F4D8B5] text-[#1B404A] font-serif dark:bg-gray-900 dark:text-white transition-colors duration-500`}
      >
        {/* Header */}
        <div className="relative flex justify-center items-center px-4">
          <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl pb-3 text-center">
            Notes App
          </h1>
          <div className="absolute right-[10%] max-sm:right-[5%] flex space-x-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="py-2 inline-flex items-center gap-2 px-3 rounded-md border transition
                 border-[#1B404A] text-gray-800 dark:bg-white/3 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-white/5
                 bg-[#D99443] hover:bg-[#e6963b]"
            >
              {theme ? <Moon size={16} /> : <Sun size={16} />}
              <span className="text-sm hidden sm:inline">
                {theme ? "Dark" : "Light"}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 px-30 pb-30">
          <div className="bg-[#f4d8b5c8] py-3 dark:bg-gray-800 rounded-md">
            <div className="max-w-md mx-auto p-10 rounded-xl shadow-md bg-[#e5c68c]  dark:bg-gray-950 dark:text-white">
              <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
              <p className="mt-2 text-sm text-center mb-6">
                Sign in to continue to your Notes
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-[#F4D8B5] dark:bg-[#f4d8b5c8] 
                   text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-[#D99443] transition"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      aria-invalid={errors.password ? "true" : "false"}
                      placeholder="Your password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-[#F4D8B5] dark:bg-[#f4d8b5c8] 
                   text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-[#D99443] transition"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Minimum 6 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <p role="alert" className="mt-1 text-xs text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white 
                    bg-[#D99443] hover:bg-[#e6963b] 
                    dark:bg-blue-600 dark:hover:bg-blue-700 
                    transition ${
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                      aria-busy={loading}
                    >
                      {loading ? "Signing in..." : "Login"}
                    </button>
                  </div>
                </div>
              </form>

              
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-6 text-center text-xs text-gray-700 dark:text-gray-400">
          © {new Date().getFullYear()} NotesApp
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
