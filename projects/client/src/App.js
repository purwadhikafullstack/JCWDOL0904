import "./App.css";
import { useDispatch } from "react-redux";

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import routes from "./routes/routes";
import { api } from "./API/api";
import { login } from "./features/userSlice";
import { data } from "./features/warehouseSlice";
import { Flex, Spinner } from "@chakra-ui/react";
import { AllCategory } from "./features/categorySlice";
import { unreadAdminCount } from "./features/adminNotificationSlice";
import { io } from "socket.io-client";
import { unreadCount } from "./features/notificationSlice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  async function getUser(token) {
    await api
      .get("/user/auth/", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => dispatch(login(res.data.user)))
      .catch((err) => {
        localStorage.removeItem("auth");
      });
  }

  async function getWarehouse() {
    await api
      .get("/warehouses/data")
      .then((res) => dispatch(data(res.data.result)));
  }

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category");
      // console.log(response);
      dispatch(AllCategory(response.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let token = null;
    if (localStorage.getItem("auth")) {
      token = JSON.parse(localStorage.getItem("auth"));
    }

    getWarehouse();
    getAllCategory();
    if (token) {
      getUser(token);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const updateUnreadCount = (unread) => {
    dispatch(unreadCount({ unread }));
  };
  useEffect(() => {
    const unreadCount = localStorage.getItem("unread");
    if (unreadCount) {
      updateUnreadCount(JSON.parse(unreadCount));
    }
  }, []);
  const updateUnreadAdminCount = (unreadAdmin) => {
    dispatch(unreadAdminCount({ unreadAdmin }));
  };
  useEffect(() => {
    const unreadCount = localStorage.getItem("adminUnreads");
    if (unreadCount) {
      updateUnreadAdminCount(JSON.parse(unreadCount));
    }
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("notificationRead", (updatedNotifications) => {
      const unread = updatedNotifications.filter((notification) => {
        return (
          notification.UserNotifications.length === 0 ||
          !notification.UserNotifications[0].read
        );
      });
      dispatch(unreadCount({ unread: unread.length }));
    });
    return () => {
      socket.off("notificationRead");
    };
  }, []);
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("notificationAdminRead", (updatedNotifications) => {
      const unreadAdmin = updatedNotifications.filter((notification) => {
        return (
          notification.UserNotifications.length === 0 ||
          !notification.UserNotifications[0].read
        );
      });
      dispatch(unreadAdminCount({ unreadAdmin: unreadAdmin.length }));
    });
    return () => {
      socket.off("notificationAdminRead");
    };
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const {data} = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/greetings`
  //     );
  //     setMessage(data?.message || "");
  //   })();
  // }, []);
  return (
    <>
      {isLoading ? (
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
      ) : (
        <Routes>{routes.map((route) => route)}</Routes>
      )}
    </>
  );
}

export default App;
