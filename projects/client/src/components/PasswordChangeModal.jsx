import { XMarkIcon } from "@heroicons/react/24/outline";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";

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

  const url = "/auth/updatepassword";
  const PasswordUpdate = async (values) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      let response = await api.post(
        url,
        {
          password: values.password,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
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
      <div className="border-t relative pt-5 bg-white px-4 sm:px-6 md:px-8 py-16 rounded-xl max-w-lg">
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
                  <div className="flex justify-center">
                    <FormLabel>Please Input Your Current Password</FormLabel>
                  </div>
                  <div className="relative">
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Password"
                        required=""
                        onChange={props.handleChange}
                        value={props.values.password}
                        as={Field}
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
                  </div>
                  <ErrorMessage name="password" component="div" />
                </div>
                <div>
                  <div className="relative">
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        placeholder="New Password"
                        required=""
                        onChange={props.handleChange}
                        value={props.values.newPassword}
                        as={Field}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={toggleNewPasswordVisibility}
                        >
                          {showNewPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </div>
                  <ErrorMessage name="newPassword" component="div" />
                </div>
                <div>
                  <div className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        required=""
                        onChange={props.handleChange}
                        value={props.values.confirmPassword}
                        as={Field}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Confirm
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
