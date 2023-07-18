import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
                    <FormLabel>Fullname</FormLabel>
                    <Input
                      name="fullname"
                      id="fullname"
                      placeholder="Fullname"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.fullname}
                      as={Field}
                    />
                    <ErrorMessage name="fullname" component="div" />
                  </div>
                  <div>
                    <FormLabel>Username</FormLabel>
                    <Input
                      name="username"
                      id="username"
                      placeholder="Username"
                      required=""
                      onChange={props.handleChange}
                      value={props.values.username}
                      as={Field}
                    />
                    <ErrorMessage name="username" component="div" />
                  </div>
                  <div>
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
                      <FormLabel>Password</FormLabel>
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
                  <div class="flex items-start"></div>
                  <button
                    type="submit"
                    class="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 my-2"
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
