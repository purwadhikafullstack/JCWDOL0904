import { useEffect, useState } from "react";
import { api } from "../../API/api";
import { PaymentProofModal } from "../../components/admin/PaymentProofModal";
import { useSelector } from "react-redux";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import io from "socket.io-client";
import Pagination from "../../components/admin/Pagination";
import OrderTable from "../../components/admin/OrderTable";
import OrderStatus from "../../components/admin/OrderStatus";
import OrderWarehouseDropdown from "../../components/admin/OrderWarehouseDropdown";
import OrderSearch from "../../components/admin/OrderSearch";
import Alert from "../../components/SwallAlert";

export default function OrderList() {
  const [transactionByWarehouse, setTransactionByWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
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

  useEffect(() => {
    const socket = io("http://localhost:8000");
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
    const socket = io("http://localhost:8000");
    socket.on("orderConfirmed", (updatedOrder) => {
      console.log(updatedOrder);
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
    <>
      <div className="px-4 mt-5 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto ml-72">
            <h1 className="text-xl font-semibold text-gray-900">
              Transactions
            </h1>
            <div className="flex gap-3 pb-3 pt-5">
              <OrderSearch
                handleSearch={handleSearch}
                invoiceNumber={invoiceNumber}
              />
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <OrderWarehouseDropdown
                  user={user}
                  handleWarehouseChange={handleWarehouseChange}
                  selectedWarehouse={selectedWarehouse}
                  warehouses={warehouses}
                />
              </div>
              <OrderStatus
                selectedStatus={selectedStatus}
                handleStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-end max-w-5xl xl ml-auto">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <OrderTable
                  transactionByWarehouse={transactionByWarehouse}
                  handleViewPaymentProof={handleViewPaymentProof}
                  handleViewOrderDetail={handleViewOrderDetail}
                  handleRejectTransaction={handleRejectTransaction}
                  fetchTransactions={fetchTransactions}
                  user={user}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Pagination
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <PaymentProofModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        selectedTransaction={selectedTransaction}
      />
      <OrderDetailModal
        isDetailModalOpen={isDetailModalOpen}
        closeDetailModal={closeDetailModal}
        selectedTransaction={selectedTransaction}
      />
    </>
  );
}
