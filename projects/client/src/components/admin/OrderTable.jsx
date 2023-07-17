import React from "react";
import { api } from "../../API/api";
import Alert from "../SwallAlert";
import Swal from "sweetalert2";
import { OrderTableRender } from "./OrderTableRender";
import moment from "moment";
import CancelOrderButton from "./CancelOrderButton";

const OrderTable = ({
  transactionByWarehouse,
  handleViewPaymentProof,
  handleViewOrderDetail,
  handleRejectTransaction,
  fetchTransactions,
  user,
  handleCantelOrder,
}) => {
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
    <OrderTableRender
      transactionByWarehouse={transactionByWarehouse}
      handleViewPaymentProof={handleViewPaymentProof}
      handleViewOrderDetail={handleViewOrderDetail}
      handleRejectTransaction={handleRejectTransaction}
      fetchTransactions={fetchTransactions}
      user={user}
      handleConfirmTransaction={handleConfirmTransaction}
      handleSendTransaction={handleSendTransaction}
      handleCantelOrder={handleCantelOrder}
    />
  );
};

export default OrderTable;
