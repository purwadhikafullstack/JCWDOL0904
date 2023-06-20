import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";

const url = "/auth/resetpassword";
const urlToken = "/auth/tokencheck";

export const InputPassword = () => {
  let navigate = useNavigate();
  let { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const tokenVerify = async () => {
    try {
      await api.get(urlToken, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      navigate("/404");
    }
  };

  const resetSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("password is required"),
    confirmPassword: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("confirm password is required"),
  });

  const TokenReset = async (values) => {
    try {
      if (token) {
        let response = await api.post(
          url,
          {
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
        });
      }
      navigate("/");
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  useEffect(() => {
    tokenVerify();
  });
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Password
            </h1>
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={resetSchema}
              onSubmit={(values) => TokenReset(values)}
            >
              {(props) => (
                <Form>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Please input your new password
                    </label>
                    <div class="relative">
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
                        class="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9.999 3C5.141 3 1.274 6.499 1.05 6.736a1 1 0 0 0 0 1.414C1.274 8.501 5.14 12 9.999 12c4.858 0 8.725-3.499 8.95-3.736a1 1 0 0 0 0-1.414C18.724 6.498 14.858 3 9.999 3zm0 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M10 3C4.477 3 0 6.462 0 10s4.477 7 10 7 10-3.462 10-7-4.477-7-10-7zm0 12a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                              clip-rule="evenodd"
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
                    <div class="relative">
                      <input
                        type={showPassword ? "text" : "password"}
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
                        class="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9.999 3C5.141 3 1.274 6.499 1.05 6.736a1 1 0 0 0 0 1.414C1.274 8.501 5.14 12 9.999 12c4.858 0 8.725-3.499 8.95-3.736a1 1 0 0 0 0-1.414C18.724 6.498 14.858 3 9.999 3zm0 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M10 3C4.477 3 0 6.462 0 10s4.477 7 10 7 10-3.462 10-7-4.477-7-10-7zm0 12a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                              clip-rule="evenodd"
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
