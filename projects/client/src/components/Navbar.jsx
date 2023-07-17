import React, {useEffect, useState} from "react";
import {Fragment} from "react";
import {Disclosure, Menu, Transition} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {Link, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {updateCart} from "../features/cartSlice";
import {useNavigate} from "react-router-dom";
import {login} from "../features/userSlice";
import {unreadCount} from "../features/notificationSlice";
import io from "socket.io-client";
import NavbarRender from "./NavbarRender";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const {user_image, id, username, email} = useSelector(
    (state) => state.userSlice
  );

  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, SetIsLogin] = useState(false);
  const [unreads, setUnreads] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("auth")) SetIsLogin(false);
    else if (localStorage.getItem("auth")) SetIsLogin(true);
  }, [localStorage.getItem("auth")]);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("notificationRead", (updatedNotifications) => {
      console.log("This is an update from the socket", updatedNotifications);

      const unread = updatedNotifications.filter((notification) => {
        return (
          notification.UserNotifications.length === 0 ||
          !notification.UserNotifications[0].read
        );
      });
      setUnreads(unread.length);
    });
    return () => {
      socket.off("notificationRead");
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("auth");
    dispatch(
      login({
        id: 0,
        fullname: "",
        username: "",
        is_verified: "",
        user_image: "",
        role: "",
      })
    );
  };

  const {cart} = useSelector((state) => state.cartSlice.value);

  const updateCartData = (cart) => {
    dispatch(updateCart({cart}));
  };
  const updateUnreadCount = (unread) => {
    dispatch(unreadCount({unread}));
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      updateCartData(JSON.parse(storedCart));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const notificationUnread = useSelector(
    (state) => state.notificationSlice.value.unread
  );
  useEffect(() => {
    const Unread = localStorage.getItem("unread");
    setUnreads(parseInt(Unread));
    setUnreads(notificationUnread);
  }, []);
  useEffect(() => {
    setUnreads(notificationUnread);
    localStorage.setItem("unread", unreads.toString());
  }, [unreads]);
  return (
    <NavbarRender
      isLogin={isLogin}
      unreads={unreads}
      cart={cart}
      user_image={user_image}
      username={username}
      email={email}
      handleLogOut={handleLogOut}
      navigation={navigation}
    />
  );
};
