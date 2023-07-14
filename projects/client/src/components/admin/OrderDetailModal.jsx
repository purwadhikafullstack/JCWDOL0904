import {useEffect} from "react";
import {api} from "../../API/api";
import {useCallback} from "react";
import {useState} from "react";
import {TruckIcon} from "@heroicons/react/20/solid";
import moment from "moment";

export default function OrderDetailModal({
  isDetailModalOpen,
  closeDetailModal,
  selectedTransaction,
}) {
  const [transactions, setTransactions] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = useCallback(async (transactionId) => {
    try {
      const response = await api.get(`/order/detail/${transactionId}`);
      setTransactions(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (isDetailModalOpen && selectedTransaction) {
      fetchTransactions(selectedTransaction);
    }
  }, [isDetailModalOpen, selectedTransaction]);

  const handleOverlayClick = (e) => {
    const isModalContentClicked = e.target.closest(".modal-content");
    if (!isModalContentClicked) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeDetailModal();
      setIsClosing(false);
    }, 300); // Adjust the duration to match the CSS animation duration
  };

  return (
    <>
      {isDetailModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            isClosing ? "closing" : ""
          }`}>
          <style>
            {`
              .modal-overlay {
                transition: opacity 0.3s ease-in-out;
              }
            
              .modal-content {
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: transparent transparent;
                position: relative;
                animation: ${
                  isClosing ? "closeModal" : "openModal"
                } 0.3s ease-in-out forwards;
                transition: opacity 0.3s ease-in-out;
              }
              
              @keyframes openModal {
                0% {
                  transform: scale(0.8);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              @keyframes closeModal {
                0% {
                  transform: scale(1);
                  opacity: 1;
                }
                100% {
                  transform: scale(0.8);
                  opacity: 0;
                }
              }
            
              .modal-content::-webkit-scrollbar {
                width: 8px;
                background-color: transparent;
                position: absolute;
                z-index: -1;
              }
            
              .modal-content::-webkit-scrollbar-thumb {
                background-color: transparent;
                border-radius: 4px;
              }
            
              .modal-content::-webkit-scrollbar-thumb:hover {
                background-color: #cfcfcf;
              }
            
              .modal-content::-webkit-scrollbar-track {
                background-color: transparent;
              }
            `}
          </style>
          <div className="modal modal-open">
            <div
              className="modal-overlay fixed inset-0 bg-black opacity-50 -z-10"
              onClick={handleOverlayClick}></div>
            <main
              className={`modal-content bg-white max-h-[600px] overflow-y-auto rounded-xl w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl sm:p-6 md:p-8 ${
                isClosing ? "closing" : ""
              }`}>
              {transactions.map((transaction) => (
                <div key={transaction.id} className="space-y-4">
                  <div>
                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      Order detail
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {moment(transaction.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                  </div>

                  <section
                    aria-labelledby="order-heading"
                    className="border-t border-gray-200">
                    {transaction.TransactionItems.map((transactionItem) => (
                      <div
                        key={transactionItem.id}
                        className="flex flex-col border-b border-gray-200 py-5">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            <a href={transactionItem.Product.product_name}>
                              {transactionItem.Product.product_name}
                            </a>
                          </h4>
                          <p className="mt-2 text-sm text-gray-600">
                            {transactionItem.Product.description}
                          </p>
                        </div>
                        <div className="mt-6 flex flex-1 items-end">
                          <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                            <div className="flex">
                              <dt className="font-medium text-gray-900">
                                Quantity
                              </dt>
                              <dd className="ml-2 text-gray-700">
                                {transactionItem.quantity}
                              </dd>
                            </div>
                            <div className="flex pl-4 sm:pl-6">
                              <dt className="font-medium text-gray-900">
                                Price
                              </dt>
                              <dd className="ml-2 text-gray-700">
                                Rp.{" "}
                                {transactionItem.price.toLocaleString("id-ID")}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    ))}

                    <div className="sm:ml-40 sm:pl-6">
                      <dl className="flex justify-between gap-x-6 py-5 text-sm">
                        <div>
                          <dt className="font-medium text-gray-900">
                            Shipping address
                          </dt>
                          <dd className="mt-2 text-gray-700">
                            <address className="not-italic">
                              <span className="block">
                                {transaction.Address.recipient_name}
                              </span>
                              <div>
                                <span>{transaction.Address.city}, </span>
                                <span>{transaction.Address.province}</span>
                              </div>
                              <span>{transaction.Address.subdistrict}, </span>
                              <span>{transaction.Address.zip}</span>
                            </address>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Shipping courier
                          </dt>
                          <dd className="mt-2 text-gray-700">
                            <p className="text-gray-900 flex gap-1 items-center">
                              <TruckIcon className="h-4" />
                              <span>
                                {transaction.courier
                                  ? transaction?.courier
                                  : null}
                              </span>
                            </p>
                            <p className="text-gray-600">2–5 business days</p>
                            <dd className="text-gray-600">
                              Rp. {transaction.ongkir.toLocaleString("id-ID")}
                            </dd>
                          </dd>
                        </div>
                      </dl>
                      <dl className="space-y-6 border-t border-gray-200 pt-5 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-900">Total</dt>
                          <dd className="text-gray-900">
                            Rp.{" "}
                            {transaction.total_price.toLocaleString("id-ID")}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </section>
                </div>
              ))}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
