import React, { useState, useEffect, useRef } from "react";
import Alert from "../../components/SwallAlert";
import { api } from "../../API/api";

const AddEkspedisiModal = ({ isOpen, onClose, fetchEkspedisi }) => {
  const [name, setName] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const modalRef = useRef();

  const handleSubmit = async () => {
    setIsLoad(true);
    try {
      const response = await api.post("/ekspedisi", { name });
      Alert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      onClose();
      fetchEkspedisi();
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    const handleOverlayClick = (event) => {
      if (event.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOverlayClick);
    }

    return () => {
      document.removeEventListener("click", handleOverlayClick);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-all duration-300 ease-in-out`}
    >
      <div
        className="absolute inset-0 -z-20 bg-black opacity-50 transition-opacity"
        ref={modalRef}
      ></div>
      <div className="bg-white w-96 rounded-lg shadow-lg py-9 px-12 transition-transform">
        <h2 className="text-xl font-semibold mb-4">Add New Ekspedisi</h2>
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium text-gray-700">
            New Ekspedisi Type
          </label>
          <select
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-opacity"
          >
            <option value="pos">pos</option>
            <option value="jne">jne</option>
            <option value="tiki">tiki</option>
          </select>
        </div>

        <div className="flex justify-end">
          {isLoad ? (
            <button
              className="bg-gray-300 text-white px-4 py-2 rounded-lg cursor-not-allowed transition-opacity"
              disabled
            >
              Loading...
            </button>
          ) : (
            <button
              className="bg-black text-white px-4 py-2 transition ease-in-out duration-400 rounded-lg hover:bg-gray-800"
              onClick={handleSubmit}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEkspedisiModal;
