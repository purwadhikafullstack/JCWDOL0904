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
import { transactionData } from "../../features/transactionSlice";
import moment from "moment";

const SalesReport = () => {
  const value = useSelector((state) => state.transactionSlice.value);
  const { role } = useSelector((state) => state.userSlice);

  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");

  useEffect(() => {
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

  const url = "/transaction/data";
  const getTransactionData = async () => {
    try {
      let result = await api.get(url);
      setTransaction(result.data);
      dispatch(transactionData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactionData();
  }, []);

  let count = 0;
  const transactionMap = value?.map((el) => {
    const date = el.transaction_date;
    const formattedDate = moment(date).format("DD MMMM YYYY");
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
          {count}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.invoice_number}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {`Rp ${el.total_price.toLocaleString()}`}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {formattedDate}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <Stack
            direction="row"
            spacing={0}
            display="flex"
            alignContent="center"
          ></Stack>
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
              Sales Report
            </h1>
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
                          Invoice Number
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Total Price
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Transaction Date
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Transaction Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {transactionMap}
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

export default SalesReport;
