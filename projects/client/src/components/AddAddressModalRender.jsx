import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useEffect } from "react";
import { useState } from "react";
import { AddAddressModalForm } from "./AddAddressModalForm";

const AddAddressModalRender = ({
  closeAddressModal,
  provinces,
  provincess,
  cities,
  recipientName,
  phoneNumber,
  city,
  subdistrict,
  zip,
  handleSubmit,
  handleProvinceChange,
  handleCityChange,
  handleRecipientNameChange,
  handlePhoneNumberChange,
  handleSubdistrictChange,
  handleZipChange,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const spinnerStyles = css`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 5px;
  `;

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      closeAddressModal();
    }, 300);
  };
  return (
    <div
      className={`fixed py-72 mt-10 px-5 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="border-t relative pt-5 bg-white px-4 sm:px-6 md:px-8 py-16 rounded-xl max-w-lg w-full">
        <XMarkIcon
          className="top-2 absolute right-2 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
          aria-hidden="true"
          onClick={handleClose}
        />
        <h2 className="text-lg font-medium text-gray-500 mt-4">
          Create New Address
        </h2>
        <AddAddressModalForm
          PulseLoader={PulseLoader}
          cities={cities}
          city={city}
          handleCityChange={handleCityChange}
          handlePhoneNumberChange={handlePhoneNumberChange}
          handleProvinceChange={handleProvinceChange}
          handleRecipientNameChange={handleRecipientNameChange}
          handleSubdistrictChange={handleSubdistrictChange}
          handleSubmit={handleSubmit}
          handleZipChange={handleZipChange}
          isLoading={isLoading}
          phoneNumber={phoneNumber}
          provinces={provinces}
          provincess={provincess}
          recipientName={recipientName}
          spinnerStyles={spinnerStyles}
          subdistrict={subdistrict}
          zip={zip}
        />
      </div>
    </div>
  );
};
export default AddAddressModalRender;
