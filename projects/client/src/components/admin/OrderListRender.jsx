import React from "react";
import OrderTable from "../../components/admin/OrderTable";
import OrderStatus from "../../components/admin/OrderStatus";
import OrderWarehouseDropdown from "../../components/admin/OrderWarehouseDropdown";
import OrderSearch from "../../components/admin/OrderSearch";
import Pagination from "../../components/admin/Pagination";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import {PaymentProofModal} from "./PaymentProofModal";

export default function OrderListRender({
  transactionByWarehouse,
  handleSearch,
  invoiceNumber,
  handleWarehouseChange,
  selectedWarehouse,
  warehouses,
  selectedStatus,
  handleStatusChange,
  handleViewPaymentProof,
  handleViewOrderDetail,
  handleRejectTransaction,
  fetchTransactions,
  user,
  totalPages,
  handlePageChange,
  isModalOpen,
  closeModal,
  selectedTransaction,
  isDetailModalOpen,
  closeDetailModal,
}) {
  return (
    <>
      <div className="px-4 mt-5 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl ml-1 font-semibold text-gray-900">
              Transactions
            </h1>
            <div className=" gap-3  pb-3 pt-5">
              <div className="flex flex-row gap-3 mb-4 items-center">
                <div className="">
                  <OrderWarehouseDropdown
                    user={user}
                    handleWarehouseChange={handleWarehouseChange}
                    selectedWarehouse={selectedWarehouse}
                    warehouses={warehouses}
                  />
                </div>
                <OrderStatus
                  selectedStatus={selectedStatus}
                  handleStatusChange={handleStatusChange}
                />
              </div>
              <OrderSearch
                handleSearch={handleSearch}
                invoiceNumber={invoiceNumber}
                placeholder={"Search Invoice Number"}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-end xl ml-auto">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <OrderTable
                  transactionByWarehouse={transactionByWarehouse}
                  handleViewPaymentProof={handleViewPaymentProof}
                  handleViewOrderDetail={handleViewOrderDetail}
                  handleRejectTransaction={handleRejectTransaction}
                  fetchTransactions={fetchTransactions}
                  user={user}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Pagination
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <PaymentProofModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        selectedTransaction={selectedTransaction}
      />
      <OrderDetailModal
        isDetailModalOpen={isDetailModalOpen}
        closeDetailModal={closeDetailModal}
        selectedTransaction={selectedTransaction}
      />
    </>
  );
}
