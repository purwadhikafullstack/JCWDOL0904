import React, { useState } from "react";
import { api } from "../../API/api";
import Alert from "../SwallAlert";
import Swal from "sweetalert2";
import { OrderTableRender } from "./OrderTableRender";

const OrderTable = ({
  transactionByWarehouse,
  handleViewPaymentProof,
  handleViewOrderDetail,
  fetchTransactions,
  user,
  handleCantelOrder,
  isLoad,
  setIsLoad,
}) => {
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const handleSendTransaction = async (transactionId) => {
    try {
      setIsLoad(true);
      let response = await api.post(`/order/send/${transactionId}`);
      Alert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      fetchTransactions();
      setIsLoad(false);
    } catch (error) {
      setIsLoad(false);
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
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
        setIsConfirmLoading(true);
        await api.post(`/mutation/auto-mutation`, {
          id: transactionId,
        });
        let response = await api.patch(`/order/confirm`, {
          id: transactionId,
        });
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
    } finally {
      setIsConfirmLoading(false);
    }
  };
  return (
    <OrderTableRender
      transactionByWarehouse={transactionByWarehouse}
      handleViewPaymentProof={handleViewPaymentProof}
      handleViewOrderDetail={handleViewOrderDetail}
      fetchTransactions={fetchTransactions}
      user={user}
      handleConfirmTransaction={handleConfirmTransaction}
      handleSendTransaction={handleSendTransaction}
      handleCantelOrder={handleCantelOrder}
      isConfirmLoading={isConfirmLoading}
      isLoad={isLoad}
    />
  );
};

export default OrderTable;
