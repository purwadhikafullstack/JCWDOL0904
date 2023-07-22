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
import { DeleteIcon } from "@chakra-ui/icons";
import EditUser from "../../components/admin/EditUserModal";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { allUserData } from "../../features/allUserSlice";
import AddAdmin from "../../components/admin/AddAdmin";
import EditWarehouse from "../../components/admin/EditAdminWarehouseModal";
import Alert from "../../components/SwallAlert";
import Pagination from "../../components/admin/Pagination";
import EmailSearch from "../../components/admin/EmailSearch";

const ManageUser = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [email, setEmailValue] = useState("");
  const value = useSelector((state) => state.allUserSlice.value);
  const user = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const url = "user/data/all";
  const getUserData = async () => {
    try {
      const response = await api.get(url, {
        params: {
          page: currentPage,
          email: email,
        },
      });
      dispatch(allUserData(response.data.result.rows));
      setTotalPages(response.data.totalPages);
    } catch (err) {
      Alert({
        title: "Failed!",
        text: err.result.data.message,
        icon: "error",
      });
    }
  };
  const deleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      dangerMode: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading...",
          text: "Please wait a sec...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const token = JSON.parse(localStorage.getItem("auth"));
        try {
          const response = await api.delete("/user/data/delete", {
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: { id },
          });
          getUserData();
          Swal.close();
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "black",
          });
        } catch (error) {
          Swal.close();
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "warning",
            confirmButtonText: "Ok",
            confirmButtonColor: "black",
          });
        }
      }
    });
  };
  useEffect(() => {
    getUserData();
  }, [currentPage, email]);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const handleSearch = (e) => {
    setEmailValue(e.target.value);
    setCurrentPage(0);
  };
  let allUser = null;
  if (user.role === "admin") {
    allUser = value.map((el) => {
      if (!el.is_deleted) {
        return (
          <tr key={el.id}>
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
                  role={el.role}
                  warehouse={el.Warehouse}
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
  } else allUser = [];
  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-2 ">Manage User</h1>
      <div>
        <AddAdmin getUserData={getUserData} />
      </div>
      <div className="mt-6 flex flex-col justify-end xl">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <EmailSearch handleSearch={handleSearch} invoiceNumber={email} />
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Username
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
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
        <div className="mt-6 flex justify-center">
          <Pagination
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
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
export default ManageUser;
