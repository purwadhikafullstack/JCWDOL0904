import { TruckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import moment from "moment";

export default function OrderDetailModalRender({
  isClosing,
  transactions,
  closeDetailModal,
}) {
  return (
    <>
      <main
        className={`modal-content bg-white max-h-[600px] px-5 py-5 overflow-y-auto rounded-xl w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl sm:p-6 md:p-8 ${
          isClosing ? "closing" : ""
        }`}
      >
        {transactions.map((transaction) => (
          <div key={transaction?.id} className="space-y-4">
            <XMarkIcon
              className="top-2 absolute right-2 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
              aria-hidden="true"
              onClick={closeDetailModal}
            />
            <div>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                Order detail
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {moment(transaction?.createdAt).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </p>
            </div>

            <section
              aria-labelledby="order-heading"
              className="border-t border-gray-200"
            >
              {transaction.TransactionItems.map((transactionItem) => (
                <div
                  key={transactionItem.id}
                  className="flex flex-col border-b border-gray-200 py-5"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      <a href={transactionItem.Product?.product_name}>
                        {transactionItem.Product?.product_name}
                      </a>
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {transactionItem.Product?.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-1 items-end">
                    <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Quantity</dt>
                        <dd className="ml-2 text-gray-700">
                          {transactionItem.quantity}
                        </dd>
                      </div>
                      <div className="flex pl-4 sm:pl-6">
                        <dt className="font-medium text-gray-900">Price</dt>
                        <dd className="ml-2 text-gray-700">
                          Rp. {transactionItem.price?.toLocaleString("id-ID")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ))}

              <div className="sm:ml-40 sm:pl-6">
                <dl className="flex justify-between gap-x-6 py-5 text-sm">
                  <div>
                    <dt className="font-medium text-gray-900">
                      Shipping address
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">
                          {transaction.Address?.recipient_name}
                        </span>
                        <div>
                          <span>{transaction.Address?.city}, </span>
                          <span>{transaction.Address.province}</span>
                        </div>
                        <span>{transaction.Address?.subdistrict}, </span>
                        <span>{transaction.Address?.zip}</span>
                      </address>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">
                      Shipping courier
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p className="text-gray-900 flex gap-1 items-center">
                        <TruckIcon className="h-4" />
                        <span>
                          {transaction.courier ? transaction?.courier : null}
                        </span>
                      </p>
                      <dd className="text-gray-600 mt-1">
                        Rp. {transaction.ongkir?.toLocaleString("id-ID")}
                      </dd>
                    </dd>
                  </div>
                </dl>
                <dl className="space-y-6 border-t border-gray-200 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">Total</dt>
                    <dd className="text-gray-900">
                      Rp. {transaction?.total_price?.toLocaleString("id-ID")}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        ))}
      </main>

      <style jsx>{`
        /* CSS media queries for responsiveness */
        @media (max-width: 640px) {
          /* Mobile styles */
          .modal-content {
            /* Add your mobile-specific styles here */
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          /* Tablet styles */
          .modal-content {
            /* Add your tablet-specific styles here */
          }
        }

        @media (min-width: 1025px) {
          /* Notebook styles */
          .modal-content {
            /* Add your notebook-specific styles here */
          }
        }
      `}</style>
    </>
  );
}
