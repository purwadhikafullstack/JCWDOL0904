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
    icon: ChartBarIcon,
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
        {/* <div className="flex flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 justify-end px-4">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  onClick={() => navigator("/admin-notification")}
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <div className="flex">
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <p>{adminUnreads ? adminUnreads : 0}</p>
                  </div>
                </button>
                <ProfileDropDown
                  classNames={classNames}
                  handleLogOut={handleLogOut}
                  userNavigation={userNavigation}
                />
              </div>
            </div>
          </div>
          <main className="flex-1">{props.mainPage}</main>
        </div> */}
      </div>
    </>
  );
}
