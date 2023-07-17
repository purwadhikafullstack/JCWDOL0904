import {useEffect, useState} from "react";
import {api} from "../API/api";
import io from "socket.io-client";
import {Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import Pagination from "../components/admin/Pagination";
import TransactionSections from "../components/TransactionsSection";
import Alert from "../components/SwallAlert";
import OrderStatus from "../components/admin/OrderStatus";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, invoiceNumber, selectedStatus]);

  const fetchTransactions = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/order/user", {
        params: {
          page: currentPage,
          invoiceNumber: invoiceNumber,
          status: selectedStatus,
        },
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setTransactions(response.data.orders);
      console.log(response);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (e) => {
    setInvoiceNumber(e.target.value);
    setCurrentPage(0);
    fetchTransactions();
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleFileUpload = async (e, transactionId) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      let response = await api.patch(
        `/order/upload-payment-proof/${transactionId}`,
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"},
        }
      );
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
  const cancelOrder = async (id) => {
    try {
      const response = await api.patch(`/order/${id}/cancel`);
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
  const acceptOrder = async (id) => {
    try {
      const response = await api.put(`/order/${id}/accept`);
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
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("transaction-update", (updatedTransaction) => {
      setTransactions((prevTransactions) => {
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
      setTransactions((prevTransactions) => {
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
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  return (
    <>
      <div className="bg-white max-w-4xl flex justify-center items-center m-auto min-h-[700px]">
        <main className="pt-24 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="m-auto max-w-full">
            <h1 className="text-3xl font-bold mb-4">Transactions</h1>
            <div className="flex gap-4">
              <InputGroup>
                <InputRightElement
                  pointerEvents="none"
                  children={<SearchIcon color="#B9BAC4" />}
                />
                <Input
                  placeholder="Search Invoice Number"
                  borderRadius="50px"
                  value={invoiceNumber}
                  onChange={handleSearch}
                  paddingX={3}
                />
              </InputGroup>
              <div>
                <OrderStatus
                  selectedStatus={selectedStatus}
                  handleStatusChange={handleStatusChange}
                />
              </div>
            </div>
            <TransactionSections
              transactions={transactions}
              handleFileUpload={handleFileUpload}
              cancelOrder={cancelOrder}
              acceptOrder={acceptOrder}
            />
          </div>
        </main>
      </div>
      <Pagination totalPages={totalPages} handlePageChange={handlePageChange} />
    </>
  );
};
