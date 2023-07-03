import React from "react";

const OrderStatus = ({selectedStatus, handleStatusChange}) => {
  return (
    <div>
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <option value="">All Status</option>
        <option value="Waiting For Payment">Waiting For Payment</option>
        <option value="Waiting For Payment Confirmation">
          Waiting For Payment Confirmation
        </option>
        <option value="On Proses">On Process</option>
        <option value="Shipped">Shipped</option>
        <option value="Order Confirmed">Order Confirmed</option>
        <option value="Canceled">Canceled</option>
      </select>
    </div>
  );
};

export default OrderStatus;
