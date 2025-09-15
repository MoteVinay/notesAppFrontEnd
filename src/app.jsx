import "./index.css";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "./api/axios"; // adjust path as needed
import useAuth from "./hooks/useAuth";

import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
// import AdminHome from "./pages/AdminHome";
import RequireAuth from "./components/requireAuth";

import Login from "./pages/Login";

function App() {
  console.log("App rendered");
  const { setAuth } = useAuth();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/me", { withCredentials: true });
        console.log("res from /me", res.data);
        if (res.data.user) {
          setAuth(res.data.user);
        }
      } catch (err) {
        setAuth({});
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const ROLE = {
    Admin: 1,
    Member: 2,
  };

  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<RequireAuth allowedRole={ROLE.Admin} />}>
          <Route path="/admin" element={<Home />} />
        </Route>

        {/* Member Routes */}
        {/* <Route element={<RequireAuth allowedRole={ROLE.Member} />}>
          <Route path="/member" element={<MemberHome />} />
        </Route> */}

        {/* Not Found Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
