import { useRef, useState } from "react";
import { BanknotesIcon, BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { api } from "../API/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddAddressModal } from "../components/AddAddressModal";
import { PasswordChangeModal } from "../components/PasswordChange";
import { login } from "../features/userSlice";
import DeleteAddressModal from "../components/DeleteAddressModal";
import Swal from "sweetalert2";

const transactions = [
  {
    id: 1,
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  },
  // More transactions...
];
const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile() {
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState(false);
  const [isSelectedDeleteAddress, setSelectedDeletedAddress] = useState(null);
  const [isDeleteAddressModalOpen, setDeleteAddressModalOpen] = useState(false);
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
          Accept: "appplication/json",
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

  let navigate = useNavigate();

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

  const handleSelectDeleteAddress = (address) => {
    setSelectedDeletedAddress(address);
    setDeleteAddressModalOpen(false);
    // console.log(address);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  const { username, user_image } = useSelector((state) => state.userSlice);

  const [addressList, setAddressList] = useState([]);

  const getUser = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const storedSelectedAddress = localStorage.getItem("selectedAddress");
        if (storedSelectedAddress) {
          setSelectedDeletedAddress(JSON.parse(storedSelectedAddress));
        } else {
          const response = await api.get(`addresses/${getUser.id}`);
          const addresses = response.data;
          if (addresses.length > 0) {
            // Find the address with 'is_default' set to true
            const defaultAddress = addresses.find(
              (address) => address.is_default === true
            );

            if (defaultAddress) {
              setSelectedDeletedAddress(defaultAddress);
            } else {
              setSelectedDeletedAddress(addresses[0]); // Set the first address as the selected address
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
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
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
            <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
              Recent activity
            </h2>
            {/* Activity table (small breakpoint and up) */}
            <div className="hidden sm:block">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mt-2 flex flex-col">
                  <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                            scope="col"
                          >
                            Transaction
                          </th>
                          <th
                            className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                            scope="col"
                          >
                            Amount
                          </th>
                          <th
                            className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                            scope="col"
                          >
                            Status
                          </th>
                          <th
                            className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                            scope="col"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="bg-white">
                            <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              <div className="flex">
                                <a
                                  href={transaction.href}
                                  className="group inline-flex space-x-2 truncate text-sm"
                                >
                                  <BanknotesIcon
                                    className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  <p className="truncate text-gray-500 group-hover:text-gray-900">
                                    {transaction.name}
                                  </p>
                                </a>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {transaction.amount}
                              </span>
                              {transaction.currency}
                            </td>
                            <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                              <span
                                className={classNames(
                                  statusStyles[transaction.status],
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                )}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                              <time dateTime={transaction.datetime}>
                                {transaction.date}
                              </time>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    <nav
                      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                      aria-label="Pagination"
                    >
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">10</span> of{" "}
                          <span className="font-medium">20</span> results
                        </p>
                      </div>
                      <div className="flex flex-1 justify-between sm:justify-end">
                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Previous
                        </a>
                        <a
                          href="#"
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Next
                        </a>
                      </div>
                    </nav>
                  </div>
                  {isPasswordChangeModalOpen && (
                    <div className="modal-overlay">
                      <PasswordChangeModal
                        closeAddressModal={closePasswordChangeModal}
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
          </div>
        </main>
      </div>
    </>
  );
}
