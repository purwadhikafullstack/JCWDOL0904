import React, {useState, useEffect} from "react";
import {api} from "../API/api";

function AddressModal({selectedAddress, onSelectAddress, closeModal}) {
  const [addressList, setAddressList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("auth"));
        const response = await api.get(`addresses/${id.id}`);
        setAddressList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }, []);

  const handleSelect = (address) => {
    onSelectAddress(address);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}>
      <div className="bg-white w-80 pb-4 rounded-lg shadow-lg max-h-[450px] overflow-y-auto transform translate-x-[-50%] translate-y-[-50%] absolute top-1/2 left-1/2">
        <h2 className="py-7 px-16 text-lg font-medium text-gray-700 text-center border-b">
          Select Address
        </h2>
        <ul className="divide-y">
          {addressList.map((address) => (
            <li
              key={address.id}
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(address)}>
              <p className="text-lg font-semibold text-gray-800">
                {address.province}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.subdistrict}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-center p-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;
