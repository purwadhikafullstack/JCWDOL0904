import { useRef, useState } from "react";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { api } from "../API/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AddAddressModal } from "../components/AddAddressModal";
import { PasswordChangeModal } from "../components/PasswordChangeModal";
import { login } from "../features/userSlice";
import DeleteAddressModal from "../components/DeleteAddressModal";
import { ChangeUsernameModal } from "../components/changeUsernameModal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import UserTransactionData from "../components/userTransaction";

export default function Profile() {
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState(false);
  const [isSelectedDeleteAddress, setSelectedDeletedAddress] = useState(null);
  const [isDeleteAddressModalOpen, setDeleteAddressModalOpen] = useState(false);
  const [isChangeUsernameModalOpen, setChangeUsernameModalOpen] =
    useState(false);
  const inputFileRef = useRef("");
  const dispatch = useDispatch();

  const handleSubmitProfile = async (e) => {
    const token = JSON.parse(localStorage.getItem("auth"));
    const formData = new FormData();
    formData.append("user_image", e.target.files[0]);
    try {
      const response = await api.post("/upload", formData, {
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      userData();
    } catch (error) {
      console.error(error);
    }
  };

  const userData = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/user/auth", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });

      dispatch(login(response.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const openAddAddressModal = () => {
    setAddAddressModalOpen(true);
  };
  const closeAddAddressModal = () => {
    setAddAddressModalOpen(false);
  };
  const openPasswordChangeModal = () => {
    setPasswordChangeModalOpen(true);
  };
  const closePasswordChangeModal = () => {
    setPasswordChangeModalOpen(false);
  };

  const openDeleteAddressModal = () => {
    setDeleteAddressModalOpen(true);
  };
  const closeDeleteAdressModal = () => {
    setDeleteAddressModalOpen(false);
  };

  const openChangeUsernameModal = () => {
    setChangeUsernameModalOpen(true);
  };
  const closeChangeUsernameModal = () => {
    setChangeUsernameModalOpen(false);
  };

  const handleSelectDeleteAddress = (address) => {
    setSelectedDeletedAddress(address);
    setDeleteAddressModalOpen(false);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  const { username, user_image } = useSelector((state) => state.userSlice);

  const token = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const storedSelectedAddress = localStorage.getItem("selectedAddress");
        if (storedSelectedAddress) {
          setSelectedDeletedAddress(JSON.parse(storedSelectedAddress));
        } else {
          const response = await api.get("addresses/all-address", {
            headers: {
              Authorization: token,
              Accept: "appplication/json",
              "Content-Type": "application/json",
            },
          });
          const addresses = response.data;
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(
              (address) => address.is_default === true
            );
            if (defaultAddress) {
              setSelectedDeletedAddress(defaultAddress);
            } else {
              setSelectedDeletedAddress(addresses[0]);
            }
          } else {
            setSelectedDeletedAddress(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <>
      <div className="min-h-full pt-20">
        <main className="flex-1 pb-8">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <img
                      className="hidden h-16 w-16 rounded-full sm:block"
                      src={user_image}
                      alt=""
                      onClick={() => inputFileRef.current.click()}
                    />
                    <input
                      type="file"
                      onChange={handleSubmitProfile}
                      ref={inputFileRef}
                      hidden
                    />
                    <div>
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-full sm:hidden"
                          src={user_image}
                          alt=""
                        />
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                          Welcome, {username}
                          <button
                            className=" h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
                            type="button"
                            onClick={openChangeUsernameModal}
                          >
                            <PencilSquareIcon />
                          </button>
                        </h1>
                      </div>
                      <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Company</dt>
                        <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                          <BuildingOfficeIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {isSelectedDeleteAddress ? (
                            <div className="mt-4 text-sm text-gray-600">
                              <div
                                key={isSelectedDeleteAddress.id}
                                className="mb-4"
                              >
                                <div className="flex gap-2">
                                  <span className="font-semibold"></span>
                                  <span>
                                    {isSelectedDeleteAddress.subdistrict},{" "}
                                    {isSelectedDeleteAddress.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>No shipping addresses found.</div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    className="inline-flex items-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    type="button"
                    onClick={openAddAddressModal}
                  >
                    Add Address
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    type="button"
                    onClick={openDeleteAddressModal}
                  >
                    Your Address
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    type="button"
                    onClick={openPasswordChangeModal}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="sm:block">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mt-2 flex flex-col">
                  <div className=""></div>
                  {isPasswordChangeModalOpen && (
                    <div className="modal-overlay">
                      <PasswordChangeModal
                        closeAddressModal={closePasswordChangeModal}
                      />
                    </div>
                  )}
                  {isChangeUsernameModalOpen && (
                    <div className="modal-overlay">
                      <ChangeUsernameModal
                        closeAddressModal={closeChangeUsernameModal}
                      />
                    </div>
                  )}
                  {isAddAddressModalOpen && (
                    <div className="modal-overlay">
                      <AddAddressModal
                        closeAddressModal={closeAddAddressModal}
                      />
                    </div>
                  )}
                  <div className="shadow-lg">
                    {isDeleteAddressModalOpen && (
                      <DeleteAddressModal
                        selectedAddress={isSelectedDeleteAddress}
                        onSelectAddress={handleSelectDeleteAddress}
                        closeModal={closeDeleteAdressModal}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <UserTransactionData />
          </div>
        </main>
      </div>
    </>
  );
}
