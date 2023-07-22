import React, { useState } from "react";
import { TransactionSectionShipping } from "./TransactionSectionShipping";
import { api } from "../API/api";
import Alert from "./SwallAlert";
import TransactionsUploadModal from "./TransactionUploadModal";

const TransactionSections = ({
  transactions,
  fetchTransactions,
  cancelOrder,
  acceptOrder,
  isCancelLoading,
  isAcceptLoading,
}) => {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFormSubmit = async () => {
    if (selectedFile && currentTransaction) {
      const transactionId = currentTransaction?.id;
      const file = selectedFile;
      const formData = new FormData();
      formData.append("file", file);
      try {
        setIsUploadLoading(true);
        let response = await api.patch(
          `/order/upload-payment-proof/${transactionId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Alert({
          title: "Success!",
          text: response.data.message,
          icon: "success",
        });
        fetchTransactions();
        setIsModalOpen(false);
        setSelectedFile(null);
      } catch (error) {
        Alert({
          title: "Failed!",
          text: error.response.data.message,
          icon: "error",
        });
        console.error(error);
      } finally {
        setIsUploadLoading(false);
      }
    }
  };
  return (
    <div>
      {transactions &&
        transactions?.map((transaction) => (
          <table
            className="mt-3 w-full text-gray-500 sm:mt-6"
            key={transaction?.id}
          >
            <div>
              <h1 className="text-xs font-bold tracking-tight text-gray-900 px-3 py-3 rounded-md sm:text-xl">
                Invoice: {transaction?.invoice_number}
              </h1>
            </div>
            <div className="pr-4">
              <caption className="sr-only">Products</caption>
              <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                <tr className="text-gray-900 font-medium">
                  <th
                    scope="col"
                    className="py-3 pr-8 w-full  sm:w-2/5 lg:w-1/3"
                  >
                    Product
                  </th>
                  <th scope="col" className="hidden w-1/5 py-3  sm:table-cell">
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pr-80 w-full sm:table-cell"
                  >
                    Description
                  </th>
                  <th scope="col" className="w-0 py-3 text-right w-full">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                {transaction?.TransactionItems?.map((transactionItem) => (
                  <tr key={transactionItem?.id}>
                    <td className="py-5">
                      <div className="flex items-center">
                        <img
                          src={`${process.env.REACT_APP_API_BASE}/${transactionItem?.Product?.product_image}`}
                          alt={transactionItem?.Product?.product_name}
                          className="mr-6 h-16 w-16 rounded object-cover object-center"
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-sm -ml-1  mr-24 text-left text-gray-900">
                            {transactionItem?.Product?.product_name}
                          </div>
                          <div className="mt-2 text-xs -ml-16 sm:hidden">
                            Rp.{" "}
                            {transactionItem?.Product?.price?.toLocaleString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden text-left py-6 pr-8 sm:table-cell">
                      Rp.{" "}
                      {transactionItem?.Product?.price?.toLocaleString("id-ID")}
                    </td>
                    <td className="text-left py-6 pr-8 text-md sm:table-cell">
                      {transactionItem?.Product?.description}
                    </td>
                    <td className="py-6 text-right font-medium">
                      <a
                        href={transactionItem?.href}
                        className="text-indigo-600"
                      >
                        <span className="hidden lg:inline md:inline">
                          {transactionItem?.quantity}
                        </span>
                        <span className="sr-only">
                          , {transactionItem?.Product?.product_name}
                        </span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
            <section
              aria-labelledby="summary-heading"
              className="mt-5 shadow-md rounded-lg transition duration-300"
            >
              <div className="bg-gray-100 py-6 px-4 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                <TransactionSectionShipping transaction={transaction} />

                <dl className="mt-8  text-sm lg:col-span-5 lg:mt-0">
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center justify-between pb-1">
                      <dt className="text-gray-900">Shipping fee</dt>
                      <dd className="font-medium text-gray-900">
                        Rp.{" "}
                        {transaction?.ongkir
                          ? transaction?.ongkir?.toLocaleString("id-ID")
                          : null}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <dt className="text-gray-900 font-medium">Order total</dt>
                      <dd className="font-medium text-gray-900">
                        Rp. {transaction?.total_price?.toLocaleString("id-ID")}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      {transaction?.status === "Shipped" && (
                        <button
                          disabled={isAcceptLoading}
                          onClick={() => acceptOrder(transaction?.id)}
                          className={`px-4 py-2 transition ease-in-out duration-300 text-xs font-medium text-white bg-black rounded-full hover:bg-gray-800 ${
                            isAcceptLoading
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          Accept Order
                        </button>
                      )}
                      {transaction?.status === "Waiting For Payment" && (
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setCurrentTransaction(transaction);
                            }}
                            className={`px-4 py-2 text-xs font-medium text-white bg-black rounded-full hover:bg-gray-800 transition ease-in-out duration-300 ${
                              isUploadLoading
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                          >
                            Upload Payment Proof
                          </button>
                          <button
                            disabled={isCancelLoading}
                            onClick={() => cancelOrder(transaction?.id)}
                            className={`transition ease-in-out duration-300 px-5 py-2 ml-4 text-xs font-medium text-black hover:bg-red-600 hover:text-white rounded-full bg-slate-100 ${
                              isCancelLoading
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </dl>
              </div>
            </section>
          </table>
        ))}

      <TransactionsUploadModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedFile={selectedFile}
        handleFileSelect={handleFileSelect}
        handleFormSubmit={handleFormSubmit}
        isUploadLoading={isUploadLoading}
      />
    </div>
  );
};

export default TransactionSections;
