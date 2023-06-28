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
  Spinner,
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
  const { role } = useSelector((state) => state.userSlice);

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
      }
    });
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
          <Stack
            direction="row"
            spacing={0}
            display="flex"
            alignContent="center"
          >
            <EditeWarehouse
              wId={el.id}
              warehouse={el.warehouse}
              province={el.province}
              city={el.city}
              warehouse_city_id={el.warehouse_city_id}
              subdistrict={el.subdistrict}
              zip={el.zip}
              runFunction={getWarehouseData}
            />
            <Button
              variant="link"
              color="red"
              width="40px"
              onClick={role === "admin" ? () => deleteWarehouse(el.id) : null}
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
      {value ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Manage Warehouse
            </h1>
          </div>
          <div className="mt-5">
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
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {warehouse}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default ManageWarehouse;
