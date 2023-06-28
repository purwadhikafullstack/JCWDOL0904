import { useEffect, useState } from "react";
import { api } from "../../API/api";
import Sidebar from "../../components/admin/Sidebar";

export default function Example() {
  const [transactionByWarehouse, setTransactionByWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  console.log(warehouses);
  console.log(transactionByWarehouse);
  console.log(selectedWarehouse);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [selectedWarehouse]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get(`/order/${selectedWarehouse}`);
      setTransactionByWarehouse(response.data.orders);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/data");
      setWarehouses(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const filteredTransactions = selectedWarehouse
    ? transactionByWarehouse.filter(
        (transaction) => transaction.id_warehouse == selectedWarehouse
      )
    : transactionByWarehouse;

  console.log(filteredTransactions);
  return (
    <>
      {/* <Sidebar /> */}
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
                onChange={handleWarehouseChange}
                value={selectedWarehouse}
                className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Warehouses</option>
                {warehouses &&
                  warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
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
                          className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Transaction ID
                        </th>

                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Payment Proof
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Total Price
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Detail
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Detail</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredTransactions &&
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                              {transaction?.invoice_number.substr(0, 13)}
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                              bgbgb
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              Rp.{" "}
                              {transaction.total_price.toLocaleString("id-ID")}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Detail
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {transaction.status}
                            </td>
                            <td className="whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button className="text-white rounded-md bg-black px-3 py-1 text-xs mr-4 hover:bg-gray-800">
                                Confirm
                              </button>
                              <button className="text-black hover:text-indigo-900">
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
