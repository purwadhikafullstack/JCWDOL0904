import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { api } from "../../API/api";
import { SettingsIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import EditUser from "../../components/admin/EditUser";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { allUserData } from "../../features/allUserSlice";
import AddAdmin from "../../components/admin/AddAdmin";
import EditWarehouse from "../../components/admin/EditAdminWarehouse";

const ManageWarehouse = () => {
  const value = useSelector((state) => state.allUserSlice.value);
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paddingLeft, setPaddingLeft] = useState("pl-72");

  useEffect(() => {
    console.log(value);

    const updatePaddingLeft = () => {
      if (window.innerWidth < 401) {
        setPaddingLeft("");
      } else {
        setPaddingLeft("pl-72");
      }
    };

    // Memanggil fungsi saat halaman dimuat dan saat ukuran layar berubah
    window.addEventListener("DOMContentLoaded", updatePaddingLeft);
    window.addEventListener("resize", updatePaddingLeft);

    // Membersihkan event listener saat komponen unmount
    return () => {
      window.removeEventListener("DOMContentLoaded", updatePaddingLeft);
      window.removeEventListener("resize", updatePaddingLeft);
    };
  }, []);

  const url = "user/data/all";
  const getUserData = async () => {
    try {
      await api.get(url).then((result) => {
        console.log(result);
        dispatch(allUserData(result.data));
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/user/data/delete/${id}`);
          console.log(response);
          getUserData();
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "warning",
            confirmButtonText: "Ok",
          });
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  let count = 0;
  const allUser = value.map((el) => {
    if (!el.is_deleted) {
      count++;
      return (
        <tr key={el.id}>
          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
            {count}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
            {el.email}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {el.username}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {el.role}
          </td>
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <Stack
              direction="row"
              spacing={0}
              display="flex"
              alignContent="center"
            >
              <EditUser
                uId={el.id}
                username={el.username}
                fullname={el.fullname}
                runFunction={getUserData}
              />
              <EditWarehouse
                uId={el.id}
                username={el.username}
                fullname={el.fullname}
                runFunction={getUserData}
              />
              <Button
                variant="link"
                color="red"
                width="40px"
                onClick={() => deleteUser(el.id)}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          </td>
        </tr>
      );
    }
  });

  return (
    <div className={` ${paddingLeft}  py-10 items-center`}>
      <h1>Manage User </h1>
      <div>
        <AddAdmin />
      </div>
      <div className="mt-6 flex flex-col justify-end max-w-5xl xl">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      No
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {allUser}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageWarehouse;
