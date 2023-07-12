import React from "react";

const OrderWarehouseDropdown = ({
  user,
  handleWarehouseChange,
  selectedWarehouse,
  warehouses,
}) => {
  return (
    <div>
      <select
        id="warehouse"
        name="warehouse"
        disabled={user.role === "adminWarehouse"}
        onChange={(e) => handleWarehouseChange(e.target.value)}
        value={selectedWarehouse}
        className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">All Warehouses</option>
        {warehouses &&
          warehouses.map((warehouse) => (
            <option
              key={warehouse.id}
              value={warehouse.id}
              disabled={
                user.role === "adminWarehouse" &&
                warehouse.id !== user.id_warehouse
              }
            >
              {warehouse.warehouse}
            </option>
          ))}
      </select>
    </div>
  );
};

export default OrderWarehouseDropdown;
