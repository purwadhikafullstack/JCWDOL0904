import React from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ShoppingCartIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import LoginModal from "./loginModal";

import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarLinks from "./NavbarLinks";

const NavbarRender = ({
  isLogin,
  unreads,
  cart,
  user_image,
  username,
  email,
  handleLogOut,
  navigation,
}) => {
  return (
    <Disclosure
      as="nav"
      className="bg-white shadow z-50 "
      style={{ position: "fixed", width: "100%" }}
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <NavbarMobileMenu open={open} />
                <div
                  className="flex flex-shrink-0 items-center cursor-pointer "
                  onClick={() => navigation("/")}
                >
                  <img
                    className="block h-8 w-auto  lg:hidden "
                    src={`${process.env.REACT_APP_API_BASE}logo_galaxy.png`}
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src={`${process.env.REACT_APP_API_BASE}logo_galaxy.png`}
                    alt="Your Company"
                  />
                  <div className="flex sm:hidden ml-40 justify-end md:hidden">
                    {isLogin ? (
                      <button
                        type="button"
                        className="rounded-full hidden bg-white p-1 text-gray-400 hover:text-gray-500"
                      >
                        <div className="flex gap-3">
                          <div className="flex">
                            <EnvelopeIcon
                              onClick={() => {
                                navigation("/notification");
                              }}
                              className="h-4 w-4"
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
                        className="rounded-full hidden bg-white p-1 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">View notifications</span>
                        <div className="flex gap-3">
                          <div className="flex">
                            <ShoppingCartIcon
                              onClick={() => {
                                navigation("/cart");
                              }}
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            <p>{cart.length}</p>
                          </div>
                        </div>
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8"></div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {isLogin ? null : <LoginModal />}
                </div>

                <NavbarLinks
                  user_image={user_image}
                  unreads={unreads}
                  Transition={Transition}
                  cart={cart}
                  handleLogOut={handleLogOut}
                  isLogin={isLogin}
                  navigation={navigation}
                />
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pt-2 pb-3">
              <Disclosure.Button
                as="a"
                onClick={() => navigation("/")}
                className="block border-l-4 border-white bg-black py-2 pl-3 pr-4 text-base font-medium text-white sm:pl-5 sm:pr-6"
              >
                Dashboard
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4 sm:px-6 justify-between">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`${process.env.REACT_APP_API_BASE}${user_image}`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {username}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {email}
                  </div>
                </div>
                <div>
                  <Disclosure.Button
                    onClick={() => {
                      navigation("/notification");
                    }}
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2"
                  >
                    <div className="flex">
                      <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />{" "}
                      <p>{unreads}</p>
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Button
                    onClick={() => {
                      navigation("/cart");
                    }}
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2"
                  >
                    <div className="flex">
                      <ShoppingCartIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                      <p>{cart.length}</p>
                    </div>
                  </Disclosure.Button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  onClick={() => navigation("/profile")}
                  as="a"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  onClick={() => navigation("/transactions")}
                  as="a"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Transactioin
                </Disclosure.Button>
                <Disclosure.Button
                  onClick={() => handleLogOut()}
                  as="a"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavbarRender;
