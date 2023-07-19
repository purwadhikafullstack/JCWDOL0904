import React from "react";
import { Menu } from "@headlessui/react";
import { Fragment } from "react";
import { EnvelopeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavbarLinks = ({
  user_image,
  Transition,
  isLogin,
  navigation,
  unreads,
  cart,
  handleLogOut,
}) => {
  return (
    <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
      {isLogin ? (
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
        >
          <div className="flex gap-3">
            <div className="flex">
              <EnvelopeIcon
                onClick={() => {
                  navigation("/notification");
                }}
                className="h-6 w-6"
                aria-hidden="true"
              />
              <p>{unreads}</p>
            </div>
          </div>
        </button>
      ) : null}
      {isLogin ? (
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <div className="flex gap-3">
            <div className="flex">
              <ShoppingCartIcon
                onClick={() => {
                  navigation("/cart");
                }}
                className="h-6 w-6"
                aria-hidden="true"
              />
              <p>{cart.length}</p>
            </div>
          </div>
        </button>
      ) : null}
      {/* Profile dropdown */}
      {isLogin ? (
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src={`${process.env.REACT_APP_API_BASE}/${user_image}`}
                alt="usr"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm"
                    )}
                    onClick={() => navigation("/profile")}
                  >
                    Your Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm"
                    )}
                    onClick={() => navigation("/transactions")}
                  >
                    Transactions
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Register
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                    )}
                    onClick={() => handleLogOut()}
                  >
                    Sign out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : null}
    </div>
  );
};

export default NavbarLinks;
