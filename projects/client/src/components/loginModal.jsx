import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { api } from "../API/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

const LoginModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const url = "/auth/login";
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
      if (response.status === 200) {
        const authData = response.data.result;
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        console.log(response);
        localStorage.setItem("auth", JSON.stringify(authData));
        console.log(authData);
        dispatch(login(response.data.data));
        onClose();
      }
    } catch (err) {
      onClose();
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div>
      <button
        className="relative inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={onOpen}
      >
        Login
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="25px">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={(values) => {
                loginAccount(values.email, values.password);
              }}
            >
              {(props) => (
                <Form>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white py-1"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white py-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Password"
                        required=""
                        as={Field}
                        onChange={props.handleChange} //setstate
                        value={props.values.password} //manggil state
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
                            strokeLinejoin="round"
                          >
                            <path
                              d="M12 18.5v.5m0 0v-.5m0 .5h6m0-9h-6m0 0H5.5a1.5 1.5 0 0 0 0 3H12m0 0a1.5 1.5 0 0 0 0-3h-2.5a1.5 1.5 0 0 0 0 3H12m0 0a1.5 1.5 0 0 0 0-3h2.5a1.5 1.5 0 0 0 0 3H12z"
                              fill="none"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" />
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 m-2">
                    Forgot password?{" "}
                    <button
                      onClick={() => {
                        navigate("/request");
                        onClose();
                      }}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Click here
                    </button>
                  </p>
                  <div className="flex items-start"></div>
                  <button
                    type="submit"
                    className="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Log in
                  </button>
                </Form>
              )}
            </Formik>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 my-1 ">
              Dont have an account?{" "}
              <Button
                onClick={() => {
                  navigate("/register");
                  onClose();
                }}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register here
              </Button>
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LoginModal;
