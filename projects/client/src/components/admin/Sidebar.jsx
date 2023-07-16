/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  ChartBarIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
  TruckIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import io from "socket.io-client";

const navigation = [
  {
    name: "Dashboard",
    href: "/order",
    icon: HomeIcon,
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
  // { name: "Product", href: "#", icon: InboxIcon, current: false },
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
const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUnreads, setAdminUnreads] = useState(0);
  const [buttonActive, setButtonActive] = useState(navigation[0].name);
  const { user_image, username } = useSelector((state) => state.userSlice);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigator("/order");
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
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-black pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src={`${process.env.REACT_APP_API_BASE}/logo_galaxy_white.png`}
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Button
                          key={item.name}
                          // href={item.href}
                          backgroundColor={
                            buttonActive === item.name ? "#4A5568" : "black"
                          }
                          _hover={{ backgroundColor: "#4A5568" }}
                          color="white"
                          width="300px"
                          justifyContent="left"
                          // href={item.href}
                          onClick={() => {
                            navigator(item.href);
                            setButtonActive(item.name);
                            setSidebarOpen(false);
                          }}
                          // className={classNames(
                          //   item.current
                          //     ? "bg-gray-900 text-white"
                          //     : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          //   "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          // )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-300"
                                : "text-gray-400 group-hover:text-gray-300",
                              "mr-4 flex-shrink-0 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Button>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-black">
            <div className="flex h-16 flex-shrink-0 justify-center items-center px-4">
              <img
                className="h-8 w-auto"
                src={`${process.env.REACT_APP_API_BASE}/logo_galaxy.png`}
                alt="Your Company"
              />
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    // href={item.href}
                    backgroundColor={
                      buttonActive === item.name ? "#4A5568" : "black"
                    }
                    _hover={{ backgroundColor: "#4A5568" }}
                    color="white"
                    width="230px"
                    justifyContent="left"
                    // href={item.href}
                    onClick={() => {
                      navigator(item.href);
                      setButtonActive(item.name);
                    }}
                    // className={classNames(
                    //   item.current
                    //     ? "bg-gray-900 text-white"
                    //     : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    //   "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    // )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-300",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className=" flex items-end">
              <h1 className="text-xs font-semibold text-gray-900 mb-5 ml-5 flex align-middle">
                Welcome, <span className="font-bold"> {username}</span>
              </h1>
            </div>
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

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user_image}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              // href={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                              onClick={(e) => handleLogOut(e)}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">{props.mainPage}</main>
        </div>
      </div>
    </>
  );
}
