import React, { useState, useEffect } from "react";
import { api } from "../API/api";
import { useDispatch, useSelector } from "react-redux";
import { addressData } from "../features/addressSlice";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function DeleteAddressModal({
  selectedAddress,
  onSelectAddress,
  closeModal,
  setSelectedDeletedAddress,
}) {
  const [addressList, setAddressList] = useState([]);
  const dispatch = useDispatch();

  const fetchAddresses = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("addresses/", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });

      setAddressList(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this address.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "black",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`addresses/${id}`);
          fetchAddresses();
          localStorage.removeItem("selectedAddress");
          setSelectedDeletedAddress(false);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleSelect = async (address) => {
    console.log(address);
    try {
      const response = await api.patch(`addresses/${address.id}`, {
        id: address.id,
        id_user: address.id_user,
      });
      console.log(response);
      onSelectAddress(response.data);
    } catch (error) {
      console.log(error);
    }
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
              className="p-4 cursor-pointer hover:bg-gray-100 flex justify-center items-center"
              onClick={() => handleSelect(address)}
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {address.province}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.subdistrict}
                </p>
              </div>
              <Button
                className="cursor-pointer hover:bg-red-100"
                display="flex"
                variant="link"
                size="xs"
                marginLeft="20px"
                justifyContent="center"
                onClick={() => handleDelete(address.id)}
              >
                <TrashIcon color="red" />
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex justify-center p-4">
          <button
            className="bg-gray-950 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAddressModal;
