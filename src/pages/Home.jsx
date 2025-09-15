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
    <div
      className={`${
        theme ? "" : "dark"
      } min-h-screen pt-20 bg-[#F4D8B5] text-[#1B404A] font-serif dark:bg-gray-900  dark:text-white  transition-colors duration-500`}
    >
      <div className="relative flex justify-center items-center px-4">
        <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl pb-3 text-center">
          Notes App
        </h1>
        <div className="absolute right-[10%] max-sm:right-[5%] space-x-4 flex">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border transition
                 border-[#1B404A] text-gray-800 hover:bg-[#e6963b] dark:bg-white/3 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-white/5
                 bg-[#D99443]"
          >
            Logout
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 px-3 rounded-md border transition
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

      <div className="p-10 px-30 pb-30">
        <div className="bg-[#e5c68c] py-3 dark:bg-gray-800 rounded-md">
          {userType === "noUser" && (
            <div className="max-w-md  mx-auto p-10 rounded-xl shadow-md bg-[#f4d8b5c8] dark:bg-gray-950 dark:text-white">
              <p className="mb-4 text-lg font-semibold ">
                Login here to start using the app 👇
              </p>
              <div className="flex justify-end mx-3">
                <Link
                  to="/login"
                  className=" px-6 py-2 bg-[#D99443] hover:bg-[#e6963b] dark:bg-blue-600  rounded-md dark:hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </div>
            </div>
          )}

          {(userType === "Admin" || userType === "Member") && (
            <div className="  p-8 shadow-lg ">
              <div className="flex justify-around items-center mb-6">
                <h1 className="text-3xl font-medium dark:text-white">
                  {userType} Home
                </h1>
              </div>
              <NotesDisplay />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
