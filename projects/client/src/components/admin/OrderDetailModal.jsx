import { useEffect } from "react";
import { api } from "../../API/api";
import { useCallback } from "react";
import { useState } from "react";
import OrderDetailModalRender from "./OrderDetailModalRender";

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
    }, 400);
  };

  return (
    <>
      {isDetailModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            isClosing ? "closing" : ""
          }`}
        >
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
              onClick={handleOverlayClick}
            ></div>
            <OrderDetailModalRender
              isClosing={isClosing}
              transactions={transactions}
            />
          </div>
        </div>
      )}
    </>
  );
}
