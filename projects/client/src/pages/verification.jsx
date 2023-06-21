import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";

const url = "/auth/verification";

export const Verification = () => {
  let navigate = useNavigate();

  let { token } = useParams();

  const verificationSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("password is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("confirm password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const TokenVerification = async (values) => {
    try {
      if (token) {
        let response = await api.post(
          url,
          {
            fullname: values.fullname,
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "black",
        });
      }
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

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Verification
            </h1>
            <Formik
              initialValues={{
                fullname: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={verificationSchema}
              onSubmit={(values) => TokenVerification(values)}
            >
              {(props) => (
                <Form>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Fullname
                    </label>
                    <div className="relative">
                      <input
                        name="fullname"
                        id="fullname"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Fullname"
                        required=""
                        onChange={props.handleChange}
                        value={props.values.fullname}
                        as={Field}
                      />
                    </div>
                    <ErrorMessage name="fullname" component="div" />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <input
                        name="username"
                        id="username"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Username"
                        required=""
                        onChange={props.handleChange}
                        value={props.values.username}
                        as={Field}
                      />
                    </div>
                    <ErrorMessage name="username" component="div" />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
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
                  <div class="flex items-start"></div>
                  <button
                    type="submit"
                    class="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    OK
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};
