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

  const toggleTheme = () => {
    if (typeof setTheme === "function") setTheme((p) => !p);
  };

  return (
    <>
      <div
        className={`${
          theme ? "" : "dark"
        } min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500`}
      >
        <div className="w-full max-w-md">
          {/* Top right theme toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition
                ${
                  theme
                    ? "bg-white/0 border-gray-200 text-gray-800 hover:bg-gray-100"
                    : "bg-white/3 border-gray-600 text-gray-100 hover:bg-white/5"
                }`}
            >
              {theme ? <Moon size={16} /> : <Sun size={16} />}
              <span className="text-sm hidden sm:inline">
                {theme ? "Dark" : "Light"}
              </span>
            </button>
          </div>

          {/* Card */}
          <div
            className={`mx-auto rounded-lg shadow-md overflow-hidden transition-colors duration-500 bg-white border border-gray-100 dark:bg-slate-800 dark:border dark:border-gray-700`}
            style={{
              boxShadow: theme
                ? "0 6px 18px rgba(15,23,42,0.06)"
                : "0 6px 18px rgba(2,6,23,0.6)",
            }}
          >
            <div className="p-8">
              <div className="mb-6 text-center">
                <h2
                  className={`text-2xl font-semibold ${
                    theme ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  Login
                </h2>
                <p
                  className={`mt-2 text-sm ${
                    theme ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Sign in to continue to your Notes
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-100`}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none
                        focus:ring-2 ${
                          theme ? "focus:ring-blue-300" : "focus:ring-sky-400"
                        } transition`}
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
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-100"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      aria-invalid={errors.password ? "true" : "false"}
                      placeholder="Your password"
                      className={`w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none
                        focus:ring-2 ${
                          theme ? "focus:ring-blue-300" : "focus:ring-sky-400"
                        } transition`}
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
                        ${
                          loading
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:brightness-95"
                        }
                        bg-blue-600`}
                      aria-busy={loading}
                    >
                      {loading ? "Signing in..." : "Login"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 text-center">
                <span
                  className={`${
                    theme ? "text-gray-600" : "text-gray-300"
                  } text-sm`}
                >
                  Don't have an account?{" "}
                </span>
                <Link to="/signup" className="align-middle ml-1">
                  <button
                    className={`text-sm underline rounded px-2 py-1 focus:outline-none
                      ${
                        theme
                          ? "text-blue-600 hover:text-blue-700"
                          : "text-sky-400 hover:text-sky-300"
                      }`}
                  >
                    Signup
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} NotesApp
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
