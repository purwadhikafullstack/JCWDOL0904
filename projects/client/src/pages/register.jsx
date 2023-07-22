import { React } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../API/api";
import { Field, ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";

const url = "/user/register";

export const Register = () => {
  let navigate = useNavigate();
  const registerSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const registerAccount = async (values) => {
    try {
      let result = await api.post(url, { email: values.email });
      Swal.fire({
        title: "Success",
        text: result.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register
            </h1>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={registerSchema}
              onSubmit={(values) => registerAccount(values)}
            >
              {(props) => (
                <Form>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Create your galaxy ID
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Email"
                      required=""
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Register
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
