import {React, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../API/api";
import Swal from "sweetalert2";
import {Field, ErrorMessage, Formik, Form} from "formik";
import * as Yup from "yup";

import {Button} from "@chakra-ui/react";
import {useDispatch} from "react-redux";
import {login} from "../features/userSlice";

const url = "/auth/login";

export const Login = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("Please input your password"),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const loginAccount = async (inputEmail, inputPassword) => {
    try {
      let response = await api.post(url, {
        email: inputEmail,
        password: inputPassword,
      });
      console.log(response);
      if (response.status == 200) {
        const {
          id,
          fullname,
          username,
          is_verified,
          user_image,
          role,
          id_warehouse,
        } = response.data.result;
        const authData = {
          id,
          fullname,
          username,
          is_verified,
          user_image,
          role,
          id_warehouse,
        };
        localStorage.setItem("auth", JSON.stringify(authData));
        console.log(authData);
        dispatch(login(authData));
        // localStorage.setItem("auth", JSON.stringify(response.data.result.id));
        // console.log(response.data.result);
        // dispatch(login(response.data.result));
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            class="w-8 h-8 mr-2"
            src="http://localhost:8000/logo_galaxy_2.png"
            alt="logo"
          />
          Galaxy
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={(values) => {
                loginAccount(values.email, values.password);
              }}>
              {(props) => (
                <Form>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Email"
                      required=""
                      onChange={props.handleChange} //setstate
                      value={props.values.email} //manggil state
                      as={Field}
                    />
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
                        as={Field}
                        onChange={props.handleChange} //setstate
                        value={props.values.password} //manggil state
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 flex items-center">
                        {showPassword ? (
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path
                              d="M15.5 9A3.5 3.5 0 1 1 12 5.5v0a3.5 3.5 0 0 1 3.5 3.5z"
                              fill="none"
                            />
                            <path
                              d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-9m0 0H7m0 0H6.5"
                              fill="none"
                            />
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
                            strokeLinejoin="round">
                            <path
                              d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-6m0 0H5.5a1.5 1.5 0 0 0 0 3H12m0 0a1.5 1.5 0 0 0 0-3h-2.5a1.5 1.5 0 0 0 0 3H12m0 0a1.5 1.5 0 0 0 0-3h2.5a1.5 1.5 0 0 0 0 3H12z"
                              fill="none"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Forgot password?{" "}
                    <Button
                      onClick={() => navigate("/request")}
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Click here
                    </Button>
                  </p>
                  <div class="flex items-start"></div>
                  <button
                    type="submit"
                    class="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Log in
                  </button>
                  <ErrorMessage name="password" component="div" />
                </Form>
              )}
            </Formik>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Dont have an account?{" "}
              <Button
                onClick={() => navigate("/register")}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Register here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
