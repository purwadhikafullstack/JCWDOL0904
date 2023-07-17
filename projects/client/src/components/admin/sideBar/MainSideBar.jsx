import React from "react";
import ProfileDropDown from "./ProfileDropDown";
import {
  Bars3BottomLeftIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

const MainSideBar = (props) => {
  return (
    <>
      <div className="flex flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => props.setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                onClick={() => props.navigator("/admin-notification")}
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <div className="flex">
                  <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
                  <p>{props.adminUnreads ? props.adminUnreads : 0}</p>
                </div>
              </button>
              <ProfileDropDown
                user_image={props.user_image}
                classNames={props.classNames}
                handleLogOut={props.handleLogOut}
                userNavigation={props.userNavigation}
              />
            </div>
          </div>
        </div>
        <main className="flex-1">{props.props.mainPage}</main>
      </div>
    </>
  );
};

export default MainSideBar;
