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
    // console.log(user);
    //needlogin true
    //adminonly true
    if (needLogin && !user.id) {
      console.log();
      nav("/login");
    } else if (guestOnly && user.id) {
      if (user.role == "admin" || user.role === "adminWarehouse") {
        nav("/order");
      } else {
        nav("/");
      }
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
    <Spinner />
  ) : user.role == "admin" || user.role === "adminWarehouse" ? (
    <>
      <Sidebar />
      {children}
    </>
  ) : (
    <div className="App">
      <Navbar /> {children} <Footer />
    </div>
  );
}
