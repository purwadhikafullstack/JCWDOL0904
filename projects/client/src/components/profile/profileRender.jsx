import {
  BuildingOfficeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { PasswordChangeModal } from "../PasswordChangeModal";
import { ChangeUsernameModal } from "../changeUsernameModal";
import { AddAddressModal } from "../AddAddressModal";
import DeleteAddressModal from "../DeleteAddressModal";
import UserTransactionData from "../userTransaction";

const ProfileRender = (props) => {
  return (
    <>
      <div className="min-h-screen pt-20">
        <main className="flex-1 pb-8">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <img
                      className="hidden h-16 w-16 rounded-full sm:block"
                      src={`${process.env.REACT_APP_API_BASE}/${props.user_image}`}
                      alt={props.user_image}
                      onClick={() => props.inputFileRef.current.click()}
                    />
                    <input
                      type="file"
                      onChange={props.handleSubmitProfile}
                      ref={props.inputFileRef}
                      hidden
                    />
                    <div>
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-full sm:hidden"
                          src={`${process.env.REACT_APP_API_BASE}${props.user_image}`}
                          alt={`${process.env.REACT_APP_API_BASE}${props.user_image}`}
                        />
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                          Welcome, {props.username}
                          <button
                            className=" h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
                            type="button"
                            onClick={props.openChangeUsernameModal}
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
                          {props.isSelectedDeleteAddress ? (
                            <div className="mt-4 text-sm text-gray-600">
                              <div
                                key={props.isSelectedDeleteAddress.id}
                                className="mb-4"
                              >
                                <div className="flex gap-2">
                                  <span className="font-semibold"></span>
                                  <span>
                                    {props.isSelectedDeleteAddress.subdistrict},{" "}
                                    {props.isSelectedDeleteAddress.city}
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
                    onClick={props.openAddAddressModal}
                  >
                    Add Address
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    type="button"
                    onClick={props.openDeleteAddressModal}
                  >
                    Your Address
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    type="button"
                    onClick={props.openPasswordChangeModal}
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
                  {props.isPasswordChangeModalOpen && (
                    <div className="modal-overlay">
                      <PasswordChangeModal
                        closeAddressModal={props.closePasswordChangeModal}
                      />
                    </div>
                  )}
                  {props.isChangeUsernameModalOpen && (
                    <div className="modal-overlay">
                      <ChangeUsernameModal
                        closeAddressModal={props.closeChangeUsernameModal}
                      />
                    </div>
                  )}
                  {props.isAddAddressModalOpen && (
                    <div className="modal-overlay">
                      <AddAddressModal
                        closeAddressModal={props.closeAddAddressModal}
                      />
                    </div>
                  )}
                  <div className="shadow-lg">
                    {props.isDeleteAddressModalOpen && (
                      <DeleteAddressModal
                        selectedAddress={props.isSelectedDeleteAddress}
                        onSelectAddress={props.handleSelectDeleteAddress}
                        closeModal={props.closeDeleteAdressModal}
                        setSelectedDeletedAddress={
                          props.setSelectedDeletedAddress
                        }
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
};

export default ProfileRender;
