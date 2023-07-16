import { React, useEffect, useState } from "react";
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

const url = "/auth/resetpassword";
const urlToken = "/auth/tokencheck";

export const InputPassword = () => {
  let navigate = useNavigate();
  let { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                      <FormLabel className="p-1">Confirm Password</FormLabel>
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
                    class="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-5 "
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
