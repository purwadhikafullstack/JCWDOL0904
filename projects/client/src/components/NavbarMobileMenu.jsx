import React from "react";
import {Disclosure} from "@headlessui/react";
import {EnvelopeIcon, ShoppingCartIcon} from "@heroicons/react/24/outline";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";

const NavbarMobileMenu = ({isLogin, navigation, unreads, cart, open}) => {
  return (
    <div className="-ml-2 mr-2 flex items-center justify-between md:hidden">
      {/* Mobile menu button */}
      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <span className="sr-only">Open main menu</span>

        {open ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
        <img
          className="block ml-5 h-8 w-auto md:hidden xl:hidden lg:hidden "
          src={`${process.env.REACT_APP_API_BASE}/logo_galaxy.png`}
          alt="Your Company"
        />
        <img
          className="hidden h-8 w-auto lg:block"
          src={`${process.env.REACT_APP_API_BASE}/logo_galaxy.png`}
          alt="Your Company"
        />
      </Disclosure.Button>
      <div className="flex ml-[352px] mr-0">
        {isLogin ? (
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
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
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
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
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
