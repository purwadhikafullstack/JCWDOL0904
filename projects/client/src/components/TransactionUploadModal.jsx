import React from "react";

const TransactionsUploadModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedFile,
  handleFileSelect,
  handleFormSubmit,
  isUploadLoading,
}) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isModalOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } transition-opacity duration-500 ease-in-out`}
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 -z-50"
        onClick={closeModal}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Upload Payment Proof</h2>
        <label
          htmlFor="fileInput"
          className="cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 ease-in-out"
        >
          Choose File
        </label>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileSelect}
        />
        {selectedFile && (
          <p className="text-sm mt-2">Selected file: {selectedFile.name}</p>
        )}
        <div className="flex justify-end items-center mt-4 border-t border-gray-300 pt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-900 rounded-full mr-2 transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 border-t border-b border-gray-300 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className={`px-4 py-2 text-sm font-medium text-black rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              isUploadLoading ? "opacity-50 cursor-not-allowed" : ""
            } border-t border-b order-gray-300 hover:bg-black hover:text-white transition-all duration-500 ease-in-out`}
            disabled={isUploadLoading}
          >
            {isUploadLoading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsUploadModal;
