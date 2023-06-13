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
    if (needLogin && !user.id) {
      nav("/login");
    } else if (guestOnly && user.id) {
      if (user.role == "admin") nav("/test");
      else nav("/");
    } else if (needLogin && user.role != "admin" && adminOnly) {
      nav("/login");
    } else if (needLogin && user.role === "admin" && adminOnly) {
      nav("/test");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // login => role="user" => routes khusus admin =>
  }, [user]);

  return isLoading ? (
    <Spinner />
  ) : user.role == "admin" ? (
    <>
      <Sidebar></Sidebar> {children}
    </>
  ) : (
    <>
      <Navbar /> {children} <Footer />
    </>
  );
}
