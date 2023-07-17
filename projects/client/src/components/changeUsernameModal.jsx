import { XMarkIcon } from "@heroicons/react/24/outline";
import { React } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { Field, Formik, Form } from "formik";
import { Input } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

export const ChangeUsernameModal = ({ closeAddressModal }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const userChangeUrl = "/user/update-username";
  const UsernameUpdate = async (values) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      let response = await api.post(
        userChangeUrl,
        { username: values.username },
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
      dispatch(login(response.data.changeUsername));
      closeAddressModal();
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.response.data.message,
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
      <div className="border-t relative pt-5 bg-white px-4 sm:px-6 md:px-8 py-16 rounded-xl max-w-lg ">
        <XMarkIcon
          className="top-2 absolute right-2 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
          aria-hidden="true"
          onClick={handleClose}
        />
        <h2 className="text-lg font-medium text-black mt-4">
          Feel Free to change your username
        </h2>
        <Formik
          initialValues={{
            username: "",
          }}
          onSubmit={(values) => UsernameUpdate(values)}
        >
          {(props) => (
            <Form>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <div className="flex justify-center"></div>
                  <Input
                    type="text"
                    value={props.values.username}
                    onChange={props.handleChange}
                    as={Field}
                    name="username"
                    id="username"
                    placeholder="Input your new username"
                    required=""
                  />
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
