import { useEffect, useState } from "react";
import { api } from "../API/api";
import io from "socket.io-client";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "../components/admin/Pagination";
import TransactionSections from "../components/TransactionsSection";
import Alert from "../components/SwallAlert";
import OrderStatus from "../components/admin/OrderStatus";
import Swal from "sweetalert2";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

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
      setTotalPages(response.data.totalPages);
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
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

  const cancelOrder = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsCancelLoading(true);
          const response = await api.patch(`/order/${id}/cancel`);
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "black",
            confirmButtonText: "ok",
          });
          setIsCancelLoading(false);
          fetchTransactions();
        } catch (error) {
          setIsCancelLoading(false);
          Swal.fire({
            title: "Failed!",
            text: error.response.data.message,
            icon: "error",
          });
        }
      }
    });
  };

  const acceptOrder = async (id) => {
    try {
      setIsAcceptLoading(true);
      const response = await api.put(`/order/${id}/accept`);
      Alert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      setIsAcceptLoading(false);
      fetchTransactions();
    } catch (error) {
      setIsAcceptLoading(false);
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  // useEffect(() => {
  //   const socket = io(`${process.env.REACT_APP_API_BASE}`);
  //   socket.on("transaction-update", (updatedTransaction) => {
  //     setTransactions((prevTransactions) => {
  //       const updatedTransactions = prevTransactions.map((transaction) => {
  //         if (transaction.id === updatedTransaction.id) {
  //           return updatedTransaction;
  //         }
  //         return transaction;
  //       });
  //       return updatedTransactions;
  //     });
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   const socket = io(`${process.env.REACT_APP_API_BASE}`);
  //   socket.on("orderConfirmed", (updatedOrder) => {
  //     setTransactions((prevTransactions) => {
  //       const updatedTransactions = prevTransactions.map((transaction) => {
  //         if (transaction.id === updatedOrder.id) {
  //           return updatedOrder;
  //         }
  //         return transaction;
  //       });
  //       return updatedTransactions;
  //     });
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  return (
    <>
      <div className="pt-24 max-w-4xl flex flex-col justify-center items-center m-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 ">Transactions</h1>
        <div className="flex gap-4 w-full">
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
      </div>

      <div className="bg-white max-w-4xl flex justify-center items-center m-auto min-h-screen">
        <main className="pt-5 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="m-auto max-w-full">
            <TransactionSections
              isCancelLoading={isCancelLoading}
              transactions={transactions}
              fetchTransactions={fetchTransactions}
              cancelOrder={cancelOrder}
              acceptOrder={acceptOrder}
              isAcceptLoading={isAcceptLoading}
            />
          </div>
        </main>
      </div>
      <Pagination totalPages={totalPages} handlePageChange={handlePageChange} />
    </>
  );
};
