import "../index.css";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import NotesDisplay from "../components/NotesDisplay";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const { theme, setTheme } = useTheme(); // boolean: true = light, false = dark

  const userType = auth?.role
    ? auth.role === 1
      ? "Admin"
      : "Member"
    : "noUser";

  const signOut = async () => {
    const { message } = await logout();
    // Optionally show toast for message here
    navigate("/");
  };

  const toggleTheme = () => setTheme(!theme);
  console.log("Theme in Home:", theme);
  return (
    <div className={`${theme?"":"dark"} mb-500 bg-white text-gray-800 dark:bg-gray-900  min-h-screen transition-colors duration-500`}>
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

      {userType === "noUser" && (
        <div className="max-w-md mx-auto mt-20 p-10 rounded-xl shadow-md bg-gray-50 dark:bg-gray-950 dark:text-white">
          <p className="mb-4 text-lg font-semibold ">
            Home page of noUser
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      )}

      {(userType === "Admin" || userType === "Member") && (
        <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6  bg-gray-100 dark:bg-gray-800">
            <h1 className="text-3xl font-bold dark:text-white">
              {userType} Home
            </h1>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
          <NotesDisplay />
        </div>
      )}
    </div>
  );
};

export default Home;
