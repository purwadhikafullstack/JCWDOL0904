// import React, { useState, useEffect } from "react";
import { apiro } from "../API/apiro";
// import { api } from "../API/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";

import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";

const url = "/auth/updatepassword";

export const PasswordChangeModal = ({ closeAddressModal }) => {
  let navigate = useNavigate();

  const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("password is required"),
    newPassword: Yup.string()
      .min(8, "New Password must contain at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("confirm password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const PasswordUpdate = async (values) => {
    console.log(values.password, values.newPassword, values.confirmPassword);
    try {
      const id = JSON.parse(localStorage.getItem("auth"));
      console.log(typeof JSON.parse(localStorage.getItem("auth")));
      let response = await api.post(url, {
        id,
        password: values.password,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      console.log(PasswordUpdate);
      console.log(response);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
    }
  };
  const handleClose = () => {
    closeAddressModal();
  };
  return (
    <div className="fixed  inset-0 flex pt-20 items-center justify-center z-10 bg-gray-800 bg-opacity-50">
      <div className="border-t relative pt-5 bg-white px-4 sm:px-6 md:px-8 py-16 rounded-xl max-w-lg w-full">
        <XMarkIcon
          className="top-2 absolute right-2 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
          aria-hidden="true"
          onClick={handleClose}
        />
        <h2 className="text-lg font-medium text-gray-500 mt-4">
          Change Password
        </h2>
        <Formik
          initialValues={{
            password: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={newPasswordSchema}
          onSubmit={(values) => PasswordUpdate(values)}
        >
          {(props) => (
            <Form>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subdistrict"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Input your current password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Password"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.password}
                      as={Field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 10v2m0-10v2m-9 9l2.12-2.12m12.72 0L15 18m4.95-6.95A8 8 0 1 0 4.34 7.34l-.54-.53L1 3l3.81-.1A8 8 0 0 0 12 3.5h.18a8.006 8.006 0 0 0 6.77 4.67l.53.11 3.02.61.63 3.02-.11.54A8 8 0 0 0 22 12c0-.33-.03-.66-.08-.98l-.1-.63-3.02-.61-.53-.11A8.006 8.006 0 0 0 19 5.82L18.89 6 22 9.11z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M15.5 9A3.5 3.5 0 1 1 12 5.5v0a3.5 3.5 0 0 1 3.5 3.5z"
                            fill="none"
                          />
                          <path
                            d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-9m0 0H7m0 0H6.5"
                            fill="none"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" />
                </div>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="New Password"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.newPassword}
                      as={Field}
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 10v2m0-10v2m-9 9l2.12-2.12m12.72 0L15 18m4.95-6.95A8 8 0 1 0 4.34 7.34l-.54-.53L1 3l3.81-.1A8 8 0 0 0 12 3.5h.18a8.006 8.006 0 0 0 6.77 4.67l.53.11 3.02.61.63 3.02-.11.54A8 8 0 0 0 22 12c0-.33-.03-.66-.08-.98l-.1-.63-3.02-.61-.53-.11A8.006 8.006 0 0 0 19 5.82L18.89 6 22 9.11z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M15.5 9A3.5 3.5 0 1 1 12 5.5v0a3.5 3.5 0 0 1 3.5 3.5z"
                            fill="none"
                          />
                          <path
                            d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-9m0 0H7m0 0H6.5"
                            fill="none"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="div" />
                </div>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Confirm Password"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.confirmPassword}
                      as={Field}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 10v2m0-10v2m-9 9l2.12-2.12m12.72 0L15 18m4.95-6.95A8 8 0 1 0 4.34 7.34l-.54-.53L1 3l3.81-.1A8 8 0 0 0 12 3.5h.18a8.006 8.006 0 0 0 6.77 4.67l.53.11 3.02.61.63 3.02-.11.54A8 8 0 0 0 22 12c0-.33-.03-.66-.08-.98l-.1-.63-3.02-.61-.53-.11A8.006 8.006 0 0 0 19 5.82L18.89 6 22 9.11z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M15.5 9A3.5 3.5 0 1 1 12 5.5v0a3.5 3.5 0 0 1 3.5 3.5z"
                            fill="none"
                          />
                          <path
                            d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-9m0 0H7m0 0H6.5"
                            fill="none"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Confirm New Password
                  {/* {props.isSubmitting ? "Loading..." : "Change Password"} */}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
