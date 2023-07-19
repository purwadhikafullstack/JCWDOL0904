import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { api } from "../API/api";
import { useDispatch, useSelector } from "react-redux";
import { transactionData } from "../features/transactionSlice";
import moment from "moment";
import OrderDetailModal from "../components/admin/OrderDetailModal";
import Alert from "./SwallAlert";

const UserTransactionData = () => {
  const userData = useSelector((state) => state.userSlice);
  const itemValue = useSelector((state) => state.transactionSlice.value);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const dispatch = useDispatch();

  const urlUserTransaction = "/transaction/user";
  const getUserTransaction = async () => {
    const token = JSON.parse(localStorage.getItem("auth"));
    try {
      const response = await api.get(urlUserTransaction, {
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      dispatch(transactionData(response.data.result));
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getUserTransaction();
  }, []);

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
  };

  const UserTransactionMap =
    itemValue?.length > 0 ? (
      itemValue.map((el) => {
        const date = el.transaction_date;
        const formattedDate = moment(date).format("DD MMMM YYYY");
        return (
          <tr key={el.id}>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-left">
              {el.invoice_number}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-left">
              {formattedDate}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-left">
              {el.status}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
              <button
                className="text-indigo-600 hover:text-indigo-900"
                onClick={() => handleViewOrderDetail(el.id)}
              >
                Detail
              </button>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td className="px-2 py-2 text-sm text-gray-900 text-center" colSpan={4}>
          You don't have any transaction
        </td>
      </tr>
    );

  return (
    <div className="mr-10 ml-10 py-10 items-center justify-center">
      {itemValue ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Last Transaction
            </h1>
          </div>
          <div className="mt-6 flex flex-col justify-end xl">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Invoice
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
                          Status
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          Detail
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {UserTransactionMap}
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
      <OrderDetailModal
        isDetailModalOpen={isDetailModalOpen}
        closeDetailModal={closeDetailModal}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};

export default UserTransactionData;
