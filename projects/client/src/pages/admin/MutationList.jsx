import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
  TabList,
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
import { useNavigate } from "react-router-dom";
import { mutation } from "../../features/mutationListSlice";

const MutationList = () => {
  const navigation = useNavigate();
  const value = useSelector((state) => state.mutationListSlice.value);
  const { role, id } = useSelector((state) => state.userSlice);
  const warehouse = useSelector((state) => state.warehouseSlice.value);
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState([]);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");
  const [sort, setSort] = useState(1);
  const [isAdmin, setIsAdmin] = useState();
  const [isError, setIsError] = useState(null);
  const swalCheckingObject = {
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  };
  const swalErrorCatch = (error) => {
    Swal.fire({ title: "Error!", text: error, icon: "error" });
  };

  const rejectMutation = async (id) => {
    Swal.fire(swalCheckingObject).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await api.patch("/mutation/rejected", {
            id,
          });
          console.log(response);
          getMutationData();
          Swal.fire("Rejected!", "Mutation has been rejected.", "success");
        }
      } catch (error) {
        console.log(error);
        swalErrorCatch(error.response.data.message).then(() => {
          getMutationData();
        });
      }
    });
  };

  const proceedMutation = async (
    id,
    warehouse_sender_id,
    warehouse_receive_id,
    qty,
    id_product
  ) => {
    Swal.fire(swalCheckingObject).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await api.patch("/mutation/proceed", {
            id,
            warehouse_sender_id,
            warehouse_receive_id,
            qty,
            id_product,
          });
          console.log(response);
          getMutationData();
          Swal.fire("Confirmed!", "Mutatition has been confirmed.", "success");
        }
      } catch (error) {
        console.log(error);
        swalErrorCatch(error.response.data.message).then(() => {
          getMutationData();
        });
      }
    });
  };

  useEffect(() => {
    // setWarehouses(warehouse)
    // console.log(warehouse);
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

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

  useEffect(() => {
    console.log(role);
  }, [role]);

  const getMutationData = async () => {
    await api
      .get("/mutation/data-mutation", {
        params: {
          sort,
          role,
          idUser: id,
        },
      })
      .then((result) => {
        console.log(result.data);
        dispatch(mutation(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMutationData();
  }, [sort]);

  let count = 0;
  const allMutation = value?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
          {count}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.request_number}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.quantity}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.Product.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.senderWarehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.receiverWarehouse.warehouse}
        </td>
        {el.status === "approved" || el.status === "rejected" ? (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            No Action
          </td>
        ) : (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              onClick={() =>
                proceedMutation(
                  el.id,
                  el.senderWarehouse.id,
                  el.receiverWarehouse.id,
                  el.quantity,
                  el.Product.id
                )
              }
            >
              Confirm
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              //   onClick={() => navigation("/manage-mutation")}
              onClick={() => rejectMutation(el.id)}
            >
              Reject
            </button>
          </td>
        )}
      </tr>
    );
  });

  useEffect(() => {
    console.log(sort);
  }, [sort]);

  const handleSorting = (value) => {
    // console.log(typeof value);
    setSort(parseInt(value));
  };

  return (
    <div className={` ${paddingLeft}  py-10 items-center mr-10`}>
      <h1>ini manage </h1>
      <div>
        {isAdmin ? (
          <button
            type="submit"
            className="mt-6 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => navigation("/manage-mutation")}
          >
            Add Mutation
          </button>
        ) : null}
      </div>
      <select
        {...(isAdmin ? {} : { disabled: true })}
        defaultValue={sort}
        onChange={(e) => handleSorting(e.target.value)}
      >
        {warehouse?.map((el) => {
          return <option value={el.id}>{el.warehouse}</option>;
        })}
      </select>

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
                      Request Number
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warehouse Sender
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warehouse Receiver
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
                  {allMutation}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationList;
