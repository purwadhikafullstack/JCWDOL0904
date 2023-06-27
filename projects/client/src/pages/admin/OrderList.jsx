import {useEffect, useState} from "react";
import {api} from "../../API/api";
import {PaymentProofModal} from "../../components/admin/PaymentProofModal";
import {useSelector} from "react-redux";
import io from "socket.io-client";
import {useCallback} from "react";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import ReactPaginate from "react-paginate";
// import "../style/Homepage.css";

export default function OrderList() {
  const [transactionByWarehouse, setTransactionByWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);

  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [totalPages, setTotalPages] = useState(0);

  console.log(warehouses);
  console.log(transactionByWarehouse);
  console.log(selectedWarehouse);
  console.log(totalPages);

  const user = useSelector((state) => state.userSlice);

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage]);

  const fetchTransactions = useCallback(async () => {
    try {
      let response;
      if (user.role === "adminWarehouse") {
        // If the user is a warehouse admin, fetch transactions for their specific warehouse
        response = await api.get(`/order/${user.id_warehouse}`, {
          params: {page: currentPage},
        });
      } else {
        // If the user is not a warehouse admin, fetch all transactions
        response = await api.get(`/order`, {
          params: {page: currentPage},
        });
      }
      console.log(response);
      const {orders, totalPages} = response.data;
      setTransactionByWarehouse(orders);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    }
  }, [user.role, user.id_warehouse, currentPage, selectedWarehouse]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/data");
      setWarehouses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWarehouseChange = (event) => {
    const selectedValue = event.target.value;
    if (user.role === "adminWarehouse") {
      // If the user is a warehouse admin, prevent changing the selected warehouse
      setSelectedWarehouse(user.id_warehouse);
    } else {
      // If the user is not a warehouse admin, update the selected warehouse
      setSelectedWarehouse(selectedValue);
    }
  };

  const filteredTransactions = selectedWarehouse
    ? transactionByWarehouse.filter(
        (transaction) => transaction.id_warehouse == selectedWarehouse
      )
    : transactionByWarehouse;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState("");

  const handleViewPaymentProof = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentProof("");
  };

  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderDetail("");
  };

  const handleRejectTransaction = async (transactionId) => {
    try {
      await api.patch(`/order/${transactionId}/reject`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      <div className="mt-5">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto ml-72">
              <h1 className="text-xl font-semibold text-gray-900">
                Transactions
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                maiores velit pariatur repudiandae asperiores nam veniam
                molestias, obcaecati libero nisi.
              </p>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-4">
              <label htmlFor="warehouse" className="sr-only">
                Warehouse
              </label>
              <select
                id="warehouse"
                name="warehouse"
                disabled={user.role === "adminWarehouse"}
                onChange={handleWarehouseChange}
                value={selectedWarehouse}
                className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">All Warehouses</option>
                {warehouses &&
                  warehouses.map((warehouse) => (
                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                      disabled={
                        user.role === "adminWarehouse" &&
                        warehouse.id !== user.id_warehouse
                      }>
                      {warehouse.warehouse}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end max-w-5xl xl ml-auto">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Transaction ID
                        </th>

                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Payment Proof
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Total Price
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Detail
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Detail</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredTransactions &&
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                              {transaction.invoice_number.substr(0, 13)}
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {transaction.payment_proof ? (
                                <button
                                  onClick={() =>
                                    handleViewPaymentProof(transaction.id)
                                  }
                                  className="text-indigo-600 hover:text-indigo-900">
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-400">
                                  Not Uploaded
                                </span>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              Rp.{" "}
                              {transaction.total_price.toLocaleString("id-ID")}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              <button
                                onClick={() =>
                                  handleViewOrderDetail(transaction.id)
                                }
                                className="text-indigo-600 hover:text-indigo-900">
                                Detail
                              </button>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {transaction.status}
                            </td>
                            <td className="whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button className="text-white rounded-md bg-black px-3 py-1 text-xs mr-4 hover:bg-gray-800">
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectTransaction(transaction.id)
                                }
                                className="text-black hover:text-indigo-900">
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={5}
                  pageCount={totalPages}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                  containerClassName="flex justify-center items-center mb-10"
                  pageLinkClassName="px-2 py-1 rounded-md m-1"
                  previousLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
                  nextLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
                  activeLinkClassName="px-2 py-1 bg-black text-white rounded-md m-1"
                />
              </div>
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
