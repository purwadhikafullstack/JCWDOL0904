import React from "react";

const CheckoutShippingSection = ({
  selectedAddress,
  openAddressModal,
  openAddAddressModal,
}) => {
  return (
    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 sm:mt-2 lg:p-8">
      <div>
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          <button
            type="button"
            disabled
            className="w-full cursor-auto py-4 text-left text-lg font-medium text-gray-500">
            Shipping address
          </button>
        </div>

        {selectedAddress ? (
          <div className="mt-4 text-sm text-gray-600">
            <div key={selectedAddress.id} className="mb-4">
              <div className="flex gap-2">
                <span className="font-semibold">Recipient Name:</span>
                <span>{selectedAddress.recipient_name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Phone Number:</span>
                <span>{selectedAddress.phone_number}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Province:</span>
                <span>{selectedAddress.province}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">City:</span>
                <span>{selectedAddress.city}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Subdistrict:</span>
                <span>{selectedAddress.subdistrict}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">ZIP:</span>
                <span>{selectedAddress.zip}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>No shipping addresses found.</div>
        )}
      </div>

      <button
        type="button"
        onClick={openAddressModal}
        className="mt-1 w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Change address
      </button>
      <button
        type="button"
        onClick={openAddAddressModal}
        className="mt-2 w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Add Address
      </button>
    </section>
  );
};

export default CheckoutShippingSection;
