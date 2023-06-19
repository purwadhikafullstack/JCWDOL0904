import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
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
import AddWarehouse from "../../components/admin/AddWarehouse";
import EditeWarehouse from "../../components/admin/EditeWarehouse";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../features/warehouseSlice";

const ManageWarehouse = () => {
  const value = useSelector((state) => state.warehouseSlice.value);
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState(null);
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

  const getWarehouseData = async () => {
    await api
      .get("/warehouses/data")
      .then((result) => {
        console.log(result);
        setWarehouses(result.data);
        dispatch(data(result.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteWarehouse = async (id) => {
    // console.log(id);
    // let wId = id;
    try {
      const response = await api.delete(`/warehouses/delete/${id}`);
      console.log(response);
      getWarehouseData();
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
  };

  useEffect(() => {
    getWarehouseData();
    // alert("klik");
  }, []);

  let count = 0;
  const warehouse = value?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
          {count}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.province}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.city}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <Stack direction="row" spacing={0}>
            <EditeWarehouse wId={el.id} runFunction={getWarehouseData} />
            <Button
              variant="link"
              color="red"
              width="40px"
              onClick={() => deleteWarehouse(el.id)}
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </td>
      </tr>
    );
  });

  return (
    <div className={` ${paddingLeft}  py-10 items-center`}>
      <h1>ini manage rpoduct</h1>
      <div>
        {/* <Button leftIcon={<AddIcon />}>Add Warehouse</Button> */}
        {/* <Button leftIcon={<AddIcon />} onClick={onOpen}>
          Add Warehouse
        </Button> */}
        <AddWarehouse runFunction={getWarehouseData} />
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
                      Warehouse Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Province
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {warehouse}
                  {/* {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {transaction.invoice_number.substr(0, 13)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                        bgbgb
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        Rp. {transaction.total_price.toLocaleString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Detail
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {transaction.status}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-white rounded-md bg-black px-3 py-1 text-xs mr-4 hover:bg-gray-800">
                          Confirm
                        </button>
                        <button className="text-black hover:text-indigo-900">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Warehouse Name</Th>
              <Th>Province</Th>
              <Th>City</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>{warehouse}</Tbody>
        </Table>
      </TableContainer> */}

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
