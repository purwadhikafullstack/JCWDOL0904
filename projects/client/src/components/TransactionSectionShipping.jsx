import React from "react";
import {TruckIcon} from "@heroicons/react/20/solid";
import moment from "moment";

export const TransactionSectionShipping = ({transaction}) => {
  return (
    <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
      <div>
        <dt className="font-medium text-gray-900">Shipping address</dt>
        <dd className="mt-2 text-gray-500">
          <span className="block">{transaction?.Address?.recipient_name}</span>
          <div>
            <span>{transaction.Address?.city}, </span>
            <span>{transaction.Address?.province}</span>
          </div>
          <span>{transaction.Address?.subdistrict}, </span>
          <span>{transaction.Address?.zip}</span>
        </dd>
      </div>
      <div className="flex flex-col items-center">
        <dt className="font-medium text-gray-900">Shipping courier</dt>
        <dd className="-ml-4 -mt-1 flex flex-wrap  items-center">
          <div className="mt-3 items-center  flex">
            <p className="text-gray-900 justify-center flex gap-1 items-center">
              <TruckIcon className="h-4 ml-4" />
              <span>{transaction?.courier} </span>
              <p className="text-gray-600"> 2–5 business days</p>
            </p>
          </div>
        </dd>
        <dt className="font-medium mt-3 block text-gray-900">Status</dt>
        <div className="mt-1">
          {transaction.status === "Canceled" ? (
            <p className="text-red-500 font-medium">{transaction.status}</p>
          ) : transaction.status === "Order Confirmed" ? (
            <p className="text-green-600 font-medium">{transaction.status}</p>
          ) : (
            <p className="text-gray-600">{transaction.status}</p>
          )}
        </div>
        <div className="mt-1">
          {transaction.status === "Waiting For Payment" ? (
            <p className="text-gray-600 text-xs">
              <span>Expired Payment: </span>
              {moment(transaction.expired).format("YYYY-MM-DD HH:mm:ss")}
            </p>
          ) : null}
        </div>
      </div>
    </dl>
  );
};
