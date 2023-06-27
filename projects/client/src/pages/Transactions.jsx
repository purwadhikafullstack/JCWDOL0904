import {useCallback, useEffect, useState} from "react";
import {api} from "../API/api";
import {TruckIcon} from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import moment from "moment";
import io from "socket.io-client";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  console.log(transactions);

  useEffect(() => {
    // Fetch transactions initially
    fetchTransactions();
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get("/order/user/2");
      setTransactions(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });

      fetchTransactions();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const response = await api.patch(`/order/cancel/${id}`);
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });

      fetchTransactions();
      console.log(response);
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: error.response.data.error,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");
    console.log(`is socket connected`, socket);

    // Event listener for transaction updates
    socket.on("transaction-update", (updatedTransaction) => {
      console.log("Received updated transaction:", updatedTransaction);
      setTransactions((prevTransactions) => {
        // console.log(prevTransactions, "this");
        if (prevTransactions.length === 0) {
          return [updatedTransaction];
        }

        const updatedTransactions = prevTransactions.map((transaction) => {
          if (transaction.id === updatedTransaction.id) {
            console.log(transaction);
            return updatedTransaction;
          }
          return transaction;
        });

        console.log(updatedTransactions, "CEK");
        return updatedTransactions;
      });
    });

    // Clean up the socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="bg-white min-h-full">
      <main className="pt-24 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="m-auto max-w-full">
          <h1 className="text-3xl font-bold mb-4">Transactions</h1>
          {transactions &&
            transactions.map((transaction) => (
              <table
                className="mt-3 w-full text-gray-500 sm:mt-6"
                key={transaction.id}>
                <div>
                  <h1 className="text-xs font-bold tracking-tight text-gray-900 px-3 py-3 rounded-md sm:text-xl">
                    Order #{transaction.invoice_number}
                  </h1>
                </div>
                <div className="pr-4">
                  <caption className="sr-only">Products</caption>
                  <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                    <tr className="text-gray-900 font-medium">
                      <th
                        scope="col"
                        className="py-3 pr-8 w-full  sm:w-2/5 lg:w-1/3">
                        Product
                      </th>
                      <th
                        scope="col"
                        className="hidden w-1/5 py-3  sm:table-cell">
                        Price
                      </th>
                      <th
                        scope="col"
                        className="hidden py-3 pr-80 w-full sm:table-cell">
                        Description
                      </th>
                      <th scope="col" className="w-0 py-3 text-right w-full">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                    {transaction.TransactionItems.map((transactionItem) => (
                      <tr key={transactionItem.id}>
                        <td className="py-5">
                          <div className="flex items-center">
                            <img
                              src={transactionItem.Product.product_image}
                              alt={transactionItem.Product.product_name}
                              className="mr-6 h-16 w-16 rounded object-cover object-center"
                            />
                            <div>
                              <div className="font-medium mr-20 text-left text-gray-900">
                                {transactionItem.Product.product_name}
                              </div>
                              <div className="mt-2 sm:hidden">
                                Rp. {transactionItem.Product.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden text-left py-6 pr-8 sm:table-cell">
                          Rp.{" "}
                          {transactionItem.Product.price.toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        <td className="text-left py-6 pr-8 sm:table-cell">
                          {transactionItem.Product.description}
                        </td>
                        <td className="py-6 text-right font-medium">
                          <a
                            href={transactionItem.href}
                            className="text-indigo-600">
                            <span className="hidden lg:inline">
                              {transactionItem.quantity}
                            </span>
                            <span className="sr-only">
                              , {transactionItem.Product.product_name}
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </div>
                {/* Billing */}
                <section aria-labelledby="summary-heading" className="mt-5">
                  <h2 id="summary-heading" className="sr-only">
                    Billing Summary
                  </h2>

                  <div className="bg-gray-100 py-6 px-4 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                    <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
                      <div>
                        <dt className="font-medium text-gray-900">
                          Shipping address
                        </dt>
                        <dd className="mt-2 text-gray-500">
                          <span className="block">
                            {transaction.Address.recipient_name}
                          </span>
                          <div>
                            <span>{transaction.Address.city}, </span>
                            <span>{transaction.Address.province}</span>
                          </div>
                          <span>{transaction.Address.subdistrict}, </span>
                          <span>{transaction.Address.zip}</span>
                        </dd>
                      </div>
                      <div className="flex flex-col items-center">
                        <dt className="font-medium text-gray-900">
                          Shipping courier
                        </dt>
                        <dd className="-ml-4 -mt-1 flex flex-wrap  items-center">
                          <div className="mt-3 items-center  flex">
                            <p className="text-gray-900 justify-center flex gap-1 items-center">
                              <TruckIcon className="h-4 ml-4" />
                              <span>{transaction.Ekspedisi.name} </span>
                              <p className="text-gray-600">
                                {" "}
                                2–5 business days
                              </p>
                            </p>
                          </div>
                        </dd>
                        <dt className="font-medium mt-3 block text-gray-900">
                          Status
                        </dt>
                        <div className="mt-1">
                          {transaction.status === "Canceled" ? (
                            <p className="text-red-500 font-medium">Canceled</p>
                          ) : (
                            <p className="text-gray-600">
                              {transaction.status}
                            </p>
                          )}
                        </div>
                        <div className="mt-1">
                          <p className="text-gray-600 text-xs">
                            Expired:{" "}
                            {moment(transaction.expired).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </p>
                        </div>
                      </div>
                    </dl>

                    <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
                      <div className="flex items-center justify-between pb-4">
                        <dt className="text-gray-600">Order total</dt>
                        <dd className="font-medium text-gray-900">
                          Rp. {transaction.total_price.toLocaleString("id-ID")}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                          <label className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
                            <input
                              type="file"
                              className="hidden"
                              disabled={transaction.status === "Canceled"}
                              onChange={(e) =>
                                handleFileUpload(e, transaction.id)
                              }
                            />
                            Upload Payment Proof
                          </label>
                          <button
                            onClick={() => cancelOrder(transaction.id)}
                            className="px-5 py-2 ml-4 text-sm font-medium text-black hover:bg-white rounded-full bg-slate-100">
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </dl>
                  </div>
                </section>
              </table>
            ))}
        </div>
      </main>
    </div>
  );
};
