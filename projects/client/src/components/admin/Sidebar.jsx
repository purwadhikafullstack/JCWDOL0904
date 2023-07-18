import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  BanknotesIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  ChartBarIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  TruckIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import { io } from "socket.io-client";
import ProfileDropDown from "./sideBar/ProfileDropDown";
import SideBarPc from "./sideBar/sideBarPc";
import SideBarMobile from "./sideBar/SideBarMobile";
import MainSideBar from "./sideBar/MainSideBar";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    current: true,
  },
  {
    name: "Transaction",
    href: "/order",
    icon: BanknotesIcon,
    current: true,
  },
  {
    name: "User",
    href: "/manage-user",
    icon: UsersIcon,
    current: true,
  },
  {
    name: "Mutation",
    href: "/mutation-list",
    icon: ArrowPathIcon,
    current: false,
  },
  {
    name: "Warehouse",
    href: "/manage-warehouse",
    icon: BuildingStorefrontIcon,
    current: true,
  },
  {
    name: "Ekspedisi",
    href: "/ekspedisi",
    icon: TruckIcon,
    current: true,
  },
  {
    name: "Category",
    href: "/manage-category",
    icon: CalendarIcon,
    current: false,
  },
  {
    name: "Product",
    href: "/manage-product",
    icon: DevicePhoneMobileIcon,
    current: false,
  },
  {
    name: "Stock",
    href: "/manage-stock",
    icon: CircleStackIcon,
    current: false,
  },
  {
    name: "Reports",
    href: "/sales-report",
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: "History",
    href: "/stock-history",
    icon: BookOpenIcon,
    current: false,
  },
];
const userNavigation = [{ name: "Sign out", href: "#" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUnreads, setAdminUnreads] = useState(0);
  const [buttonActive, setButtonActive] = useState(navigation[0].name);
  const { user_image } = useSelector((state) => state.userSlice);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigator("/dashboard");
  }, []);

  const handleLogOut = (e) => {
    e.preventDefault();
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

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("notificationAdminRead", (updatedNotifications) => {
      console.log("This is an update from the socket", updatedNotifications);
      const unreadAdmin = updatedNotifications.filter((notification) => {
        return (
          notification.UserNotifications.length === 0 ||
          !notification.UserNotifications[0].read
        );
      });
      setAdminUnreads(unreadAdmin.length);
    });

    return () => {
      socket.off("notificationAdminRead");
    };
  }, []);

  const notificationAdminUnread = useSelector(
    (state) => state.adminNotificationSlice.value.unreadAdmin
  );

  useEffect(() => {
    const storedAdminUnreads = localStorage.getItem("adminUnreads");
    setAdminUnreads(parseInt(storedAdminUnreads));
    setAdminUnreads(notificationAdminUnread);
  }, []);
  useEffect(() => {
    setAdminUnreads(notificationAdminUnread);
    localStorage.setItem("adminUnreads", adminUnreads.toString());
  }, [adminUnreads]);
  return (
    <>
      <div>
        <SideBarMobile
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          buttonActive={buttonActive}
          setButtonActive={setButtonActive}
          classNames={classNames}
          navigator={navigator}
        />
        <SideBarPc
          navigation={navigation}
          buttonActive={buttonActive}
          setButtonActive={setButtonActive}
          classNames={classNames}
          navigator={navigator}
        />
        <MainSideBar
          user_image={user_image}
          props={props}
          classNames={classNames}
          handleLogOut={handleLogOut}
          adminUnreads={adminUnreads}
          navigator={navigator}
          setSidebarOpen={setSidebarOpen}
          userNavigation={userNavigation}
        />
      </div>
    </>
  );
}
