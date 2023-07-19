import { useEffect, useState } from "react";
import { api } from "../../API/api";
import moment from "moment";

export const PaymentProofModal = ({
  isOpen,
  closeModal,
  selectedTransaction,
}) => {
  const [paymentProof, setPaymentProof] = useState("avatar_default.jpg");
  const [expired, setExpired] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPaymentProof = async (transactionId) => {
    try {
      const response = await api.get(`/order/${transactionId}/payment-proof`);
      const { payment_proof, expired } = response.data;
      setPaymentProof(payment_proof);
      setExpired(expired);
    } catch (error) {
      console.log({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
    if (isOpen && selectedTransaction) {
      fetchPaymentProof(selectedTransaction);
    }
  }, [isOpen, selectedTransaction]);

  const handleOverlayClick = (e) => {
    const isModalContentClicked = e.target.closest(".modal-content");
    if (!isModalContentClicked) {
      closeModal();
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
            <style>
              {`
            .modal-overlay {
              transition: opacity 0.3s ease-in-out;
            }

                .overflow-y-auto::-webkit-scrollbar {
                  width: 0.5em;
                  background-color: transparent;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background-color: #cfcfcf;
                  border-radius: 10px;
                  height: 2px;
                }
              `}
            </style>
            <div
              className={`modal-overlay overflow-y-auto fixed inset-0 bg-black ${
                isModalOpen ? "opacity-50" : "opacity-0"
              }`}
              onClick={handleOverlayClick}
            ></div>
            <div className="bg-white rounded-lg shadow-sm max-w-sm mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="modal-header flex justify-between items-center bg-gray-200 rounded-t-lg py-3 px-6">
                <h2 className="text-lg text-gray-800 font-bold">
                  Payment Proof
                </h2>
                <h2 className="text-xs text-gray-700">
                  {moment(expired).format("YYYY-MM-DD HH:mm:ss")}
                </h2>
              </div>
              <div className="modal-body p-6 overflow-y-auto max-h-[500px]">
                <img
                  src={`${process.env.REACT_APP_API_BASE}/${paymentProof}`}
                  alt="Payment Proof"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
