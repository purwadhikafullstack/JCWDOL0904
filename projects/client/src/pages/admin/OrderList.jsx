import { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Alert from "../../components/SwallAlert";
import OrderListRender from "../../components/admin/OrderListRender";
import Swal from "sweetalert2";

export default function OrderList() {
  const [transactionByWarehouse, setTransactionByWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const user = useSelector((state) => state.userSlice);

  useEffect(() => {
    fetchWarehouses();
  }, []);
  useEffect(() => {
    fetchTransactions();
  }, [selectedWarehouse, invoiceNumber, currentPage, selectedStatus]);

  const fetchTransactions = async () => {
    try {
      let response;
      if (user.role === "adminWarehouse") {
        response = await api.get(`/order/${user.id_warehouse}`, {
          params: {
            page: currentPage,
            invoiceNumber: invoiceNumber,
            status: selectedStatus,
          },
        });
      } else {
        response = await api.get(`/order`, {
          params: {
            page: currentPage,
            warehouseId: selectedWarehouse,
            invoiceNumber: invoiceNumber,
            status: selectedStatus,
          },
        });
      }
      const { orders, totalPages } = response.data;
      setTransactionByWarehouse(orders);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (e) => {
    setInvoiceNumber(e.target.value);
    setCurrentPage(0);
    fetchTransactions();
  };
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/data");
      setWarehouses(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };
  const handleWarehouseChange = (event) => {
    const selectedValue = event.target.value;
    if (user.role === "adminWarehouse") {
      setSelectedWarehouse(user.id_warehouse);
    } else {
      setSelectedWarehouse(selectedValue);
    }
  };
  const handleViewPaymentProof = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleRejectTransaction = async (transactionId) => {
    try {
      await api.patch(`/order/${transactionId}/reject`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  const handleCantelOrder = async (dataTransaction) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await api.post("/order/order-cancel", {
            dataTransaction,
          });
          fetchTransactions();
          Swal.fire(
            "Canceled!",
            "User transaction has been deleted.",
            "success"
          );
        } catch (error) {
          Alert({
            title: "Failed!",
            text: "Something went wrong",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_BASE}`);
    socket.on("transaction-update", (updatedTransaction) => {
      setTransactionByWarehouse((prevTransactions) => {
        const updatedTransactions = prevTransactions.map((transaction) => {
          if (transaction.id === updatedTransaction.id) {
            return updatedTransaction;
          }
          return transaction;
        });
        return updatedTransactions;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_BASE}`);
    socket.on("orderConfirmed", (updatedOrder) => {
      setTransactionByWarehouse((prevTransactions) => {
        const updatedTransactions = prevTransactions.map((transaction) => {
          if (transaction.id === updatedOrder.id) {
            return updatedOrder;
          }
          return transaction;
        });
        return updatedTransactions;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <OrderListRender
      transactionByWarehouse={transactionByWarehouse}
      handleSearch={handleSearch}
      invoiceNumber={invoiceNumber}
      handleWarehouseChange={handleWarehouseChange}
      selectedWarehouse={selectedWarehouse}
      warehouses={warehouses}
      selectedStatus={selectedStatus}
      handleStatusChange={handleStatusChange}
      handleViewPaymentProof={handleViewPaymentProof}
      handleViewOrderDetail={handleViewOrderDetail}
      handleRejectTransaction={handleRejectTransaction}
      fetchTransactions={fetchTransactions}
      user={user}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      selectedTransaction={selectedTransaction}
      isDetailModalOpen={isDetailModalOpen}
      closeDetailModal={closeDetailModal}
      handleCantelOrder={handleCantelOrder}
    />
  );
}
