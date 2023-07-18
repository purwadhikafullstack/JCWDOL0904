import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { api } from "../API/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

const LoginModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const url = "/auth/login";
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("Please input your password"),
  });
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
          confirmButtonColor: "black",
        });
        localStorage.setItem("auth", JSON.stringify(authData));
        dispatch(login(response.data.data));
        onClose();
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
      onClose();
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <button
        className="relative inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={onOpen}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
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
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.email}
                      as={Field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          loginAccount(
                            props.values.email,
                            props.values.password
                          );
                        }
                      }}
                    />
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Password"
                      required=""
                      as={Field}
                      onChange={props.handleChange}
                      value={props.values.password}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          loginAccount(
                            props.values.email,
                            props.values.password
                          );
                        }
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <ErrorMessage name="password" component="div" />
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
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
                  <button
                    type="submit"
                    className="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 mb-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
