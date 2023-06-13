import { React } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "@chakra-ui/react";

const url = "/auth/login";

export const Login = () => {
  let navigate = useNavigate();

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

      if ((response.status = 200)) {
        localStorage.setItem("idUser", JSON.stringify(response.data.result.id));
        navigate("/home");
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
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
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
              }}
              // loginAccount(values.email, values.password);
              //formik => form
              //form => validation
              //validation akan jalan pada saat schema tidak terpenuhi
              // untuk cek dipenuhi/tidak lewat sebuah function onSubmit
              // untuk fomrik yang bukan HOOKS
              // semua button di dalam content component FORMIK akan dianggap onsubmit apabila type nya adalah submit
            >
              {(props) => (
                <Form>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
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
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Password"
                      required=""
                      as={Field}
                      onChange={props.handleChange} //setstate
                      value={props.values.password} //manggil state
                    />
                  </div>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Forgotten password?{" "}
                    <Button
                      onClick={() => navigate("/request")}
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Click here
                    </Button>
                  </p>
                  <div class="flex items-start"></div>
                  <button
                    type="submit"
                    class="w-full text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
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
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
