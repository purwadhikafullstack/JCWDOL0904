import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";

export default function ProtectedPage({
  needLogin = false,
  guestOnly = false, //true
  children,
  adminOnly = false, //true
}) {
  const user = useSelector((state) => state.userSlice);
  const nav = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (needLogin && !user.email) {
      // console.log();
      nav("/");
    } else if (guestOnly && user.email) {
      if (user.role == "admin" || user.role === "adminWarehouse") {
        nav("/order");
      } else {
        nav("/");
      }
    } else if (needLogin && !adminOnly && user.role !== "user") {
      nav("/order");
    } else if (
      needLogin &&
      user.role !== "admin" &&
      user.role !== "adminWarehouse" &&
      adminOnly
    ) {
      nav("/");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // login => role="user" => routes khusus admin =>
  }, [user, needLogin]);

  return isLoading ? (
    <div
      style={{
        display: "Flex",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={`${process.env.REACT_APP_API_BASE}/logo_galaxy_2.png`}
        className="w-32 h-28 align-middle rounded-full animate-bounce"
      />
    </div>
  ) : user.role == "admin" || user.role === "adminWarehouse" ? (
    <>
      <Sidebar mainPage={children} />
      {/* {children} */}
    </>
  ) : (
    <div className="App">
      <Navbar /> {children} <Footer />
    </div>
  );
}
