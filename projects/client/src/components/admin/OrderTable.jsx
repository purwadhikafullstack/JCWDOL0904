import React from "react";
import {api} from "../../API/api";
import Alert from "../SwallAlert";
import Swal from "sweetalert2";
import moment from "moment";

const OrderTable = ({
  transactionByWarehouse,
  handleViewPaymentProof,
  handleViewOrderDetail,
  handleRejectTransaction,
  fetchTransactions,
  user,
}) => {
  const adminWarehouse = user.role === "adminWarehouse";

  const handleSendTransaction = async (transactionId) => {
    try {
      let response = await api.post(`/order/send/${transactionId}`);
      Alert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      fetchTransactions();
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
      console.error(error);
    }
  };

  const handleConfirmTransaction = async (transactionId) => {
    try {
      const shouldConfirm = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to confirm this transaction?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm",
        confirmButtonColor: "black",
        cancelButtonText: "Cancel",
        dangerMode: true,
      });
      if (shouldConfirm.isConfirmed) {
        await api.post(`/mutation/auto-mutation`, {
          id: transactionId,
        });
        let response = await api.patch(`/order/confirm`, {
          id: transactionId,
        });
        console.log(response);
        Alert({
          title: "Success!",
          text: response.data.message,
          icon: "success",
        });
        fetchTransactions();
      }
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
      console.log(error);
    }
  };
  return (
    <div className="">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Invoice Number
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Payment Proof
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Total Price
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Detail
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Expired
            </th>
            <th
              scope="col"
              className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Detail</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactionByWarehouse &&
            transactionByWarehouse.map((transaction) => (
              <tr key={transaction.id}>
                <td className="whitespace-nowrap py-2 pl-4 pr-2 text-sm text-gray-500 sm:pl-6">
                  {transaction?.invoice_number.substr(0, 13)}
                </td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  {transaction.payment_proof ? (
                    <button
                      onClick={() => handleViewPaymentProof(transaction.id)}
                      className="text-indigo-600 hover:text-indigo-900">
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">Not Uploaded</span>
                  )}
                </td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  Rp. {transaction.total_price.toLocaleString("id-ID")}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <button
                    onClick={() => handleViewOrderDetail(transaction.id)}
                    className="text-indigo-600 hover:text-indigo-900">
                    Detail
                  </button>
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  {transaction.status}
                </td>
                {transaction.status === "Waiting For Payment" ||
                transaction.status === "Waiting For Payment Confirmation" ? (
                  <td className="whitespace-nowrap text-xs px-2 py-2 text-sm text-gray-500">
                    {moment(transaction.expired).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                ) : (
                  <span
                    className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                    style={{visibility: "hidden"}}>
                    Exp
                  </span>
                )}
                <td className="whitespace-nowrap py-2 text-right text-sm font-medium sm:pr-6">
                  {transaction.status === "Waiting For Payment Confirmation" ? (
                    <button
                      disabled={adminWarehouse}
                      onClick={() => handleConfirmTransaction(transaction.id)}
                      className="text-white rounded-md bg-black w-14 h-6 text-[10px] mr-[9px] hover:bg-gray-800">
                      Confirm
                    </button>
                  ) : (
                    <span style={{visibility: "hidden"}}>Confirm</span>
                  )}
                  {transaction.status === "On Process" ? (
                    <button
                      disabled={adminWarehouse}
                      onClick={() => handleSendTransaction(transaction.id)}
                      className="text-white rounded-md bg-green-700 w-14 h-6 text-[10px] -mr-7 hover:bg-green-800">
                      Send
                    </button>
                  ) : (
                    <span
                      className="text-white rounded-md bg-green-700 w-14 h-6 text-[10px] -mr-7 hover:bg-green-800"
                      style={{visibility: "hidden"}}>
                      Send
                    </span>
                  )}
                  {transaction.status === "Waiting For Payment Confirmation" ? (
                    <button
                      disabled={adminWarehouse}
                      onClick={() => handleRejectTransaction(transaction.id)}
                      className="text-white w-14 h-6 text-[10px] rounded-md bg-black hover:bg-gray-800 mr-1">
                      Reject
                    </button>
                  ) : (
                    <span
                      className="text-white w-14 h-6 text-[10px] rounded-md bg-black hover:bg-gray-800 mr-1"
                      style={{visibility: "hidden"}}>
                      Reject
                    </span>
                  )}
                  {transaction.status === "Waiting For Payment Confirmation" ||
                  transaction.status === "Waiting For Payment" ||
                  transaction.status === "On Process" ? (
                    <button
                      disabled={adminWarehouse}
                      className="text-white -mr-2 rounded-md w-14 h-6 text-[10px] bg-red-700 hover:bg-red-800">
                      Cancel
                    </button>
                  ) : (
                    <span
                      className="text-white rounded-md w-14 h-6 text-[10px] bg-red-700 hover:bg-red-800"
                      style={{visibility: "hidden"}}>
                      Cancel
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
