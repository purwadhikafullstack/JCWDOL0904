import React from "react";

const OrderWarehouseDropdown = ({
  user,
  handleWarehouseChange,
  selectedWarehouse,
  warehouses,
}) => {
  const isAdminWarehouse = user.role === "adminWarehouse";
  const adminWarehouse = isAdminWarehouse
    ? warehouses.find((warehouse) => warehouse.id === user.id_warehouse)
    : null;

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
        {!isAdminWarehouse && <option value="">All Warehouses</option>}
        {isAdminWarehouse && adminWarehouse && (
          <option value={adminWarehouse.id}>{adminWarehouse.warehouse}</option>
        )}
        {warehouses &&
          warehouses.map((warehouse) => (
            <option
              key={warehouse.id}
              value={warehouse.id}
              disabled={isAdminWarehouse && warehouse.id !== adminWarehouse?.id}
            >
              {warehouse.warehouse}
            </option>
          ))}
      </select>
    </div>
  );
};

export default OrderWarehouseDropdown;
