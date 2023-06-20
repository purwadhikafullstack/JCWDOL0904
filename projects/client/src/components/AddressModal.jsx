import React, { useState, useEffect } from "react";
import { api } from "../API/api";

function AddressModal({ selectedAddress, onSelectAddress, closeModal }) {
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("addresses/9");
        setAddressList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddresses();
  }, []);

  const handleSelect = (address) => {
    onSelectAddress(address);
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 pt-20 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-80 pb-4 rounded-lg shadow-lg max-h-[450px] overflow-y-auto">
        <h2 className="py-7 px-16 text-lg font-medium text-gray-700 text-center border-b">
          Select Address
        </h2>
        <ul className="divide-y">
          {addressList.map((address) => (
            <li
              key={address.id}
              className="p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(address)}
            >
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
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;
