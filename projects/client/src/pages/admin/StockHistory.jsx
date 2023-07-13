import React, { useEffect, useState } from "react";
import { Stack, Spinner, Select } from "@chakra-ui/react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { transactionData } from "../../features/transactionSlice";
import { transactionItemData } from "../../features/transactionItemSlice";
import moment from "moment";
import Pagination from "../../components/admin/Pagination";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import OrderSearch from "../../components/admin/OrderSearch";
import OrderWarehouseDropdown from "../../components/admin/OrderWarehouseDropdown";
import ProductCategoryDropdown from "../../components/admin/ProductCategoryDropdown";
import ProductSearch from "../../components/admin/ProductSearch";
import { stockHistoryData } from "../../features/stockHistorySlice";

const StockHistory = () => {
  const itemValue = useSelector((state) => state.transactionItemSlice.value);
  const stockHistoryValue = useSelector(
    (state) => state.stockHistorySlice.value
  );
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [sort, setSort] = useState("ASC");
  const user = useSelector((state) => state.userSlice);
  const [productSearch, setProductSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    const updatePaddingLeft = () => {
      if (window.innerWidth < 401) {
        setPaddingLeft("");
      } else {
        setPaddingLeft("pl-72");
      }
    };
    window.addEventListener("DOMContentLoaded", updatePaddingLeft);
    window.addEventListener("resize", updatePaddingLeft);
    return () => {
      window.removeEventListener("DOMContentLoaded", updatePaddingLeft);
      window.removeEventListener("resize", updatePaddingLeft);
    };
  }, []);

  const urlHistory = "stock-history/history";
  const getHistoryData = async () => {
    try {
      let selectWarehouse;
      if (user.id_warehouse) {
        selectWarehouse = user.id_warehouse;
      } else {
        selectWarehouse = selectedWarehouse;
      }
      // console.log(selectedWarehouse);
      console.log(selectedMonth);
      let response = await api.get(urlHistory, {
        params: {
          page: currentPage,
          userId: user.id,
          productSearch,
          role: user.role,
          warehouse: selectWarehouse,
          month: selectedMonth,
          sort,
          order,
        },
      });
      console.log(response);
      setTotalPage(response.data.totalPage);
      console.log(totalPage);
      dispatch(stockHistoryData(response.data.result.rows));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/data");
      setWarehouses(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePage = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    getHistoryData();
  }, [
    currentPage,
    productSearch,
    selectedWarehouse,
    selectedMonth,
    sort,
    order,
  ]);

  useEffect(() => {
    getHistoryData();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [selectedWarehouse, selectedMonth]);

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
  };

  const handleWarehouseChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    if (user.role === "adminWarehouse") {
      setSelectedWarehouse(user.id_warehouse);
    } else {
      setSelectedWarehouse(selectedValue);
      // console.log(setSelectedWare)
    }
  };

  const handleSorting = (value) => {
    if (value === "1") {
      setOrder("createdAt");
      setSort("DESC");
    } else {
      setOrder("CreatedAt");
      setSort("ASC");
    }
  };

  const HistoryDataMap = stockHistoryValue?.map((historyValue) => {
    const date = historyValue.createdAt;
    const formattedDate = moment(date).format("DD MMMM YYYY");
    const stockOut = historyValue.status === "in" ? "-" : historyValue.status;
    const stockIn = historyValue.status === "out" ? "-" : historyValue.status;
    // console.log(historyValue);
    return (
      <tr key={historyValue}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {historyValue.Product.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {formattedDate}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {historyValue.quantity}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {historyValue.Warehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {stockIn}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {stockOut}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {historyValue.current_stock}
        </td>
      </tr>
    );
  });

  return (
    <div className={` ${paddingLeft}  py-10 items-center`}>
      {itemValue ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Stock History
            </h1>
            <Stack direction={"row"} className="flex gap-3 pb-3 pt-5">
              <ProductSearch
                handleSearch={setProductSearch}
                productSearch={productSearch}
              />
            </Stack>
            <Stack direction="row">
              <OrderWarehouseDropdown
                user={user}
                handleWarehouseChange={setSelectedWarehouse}
                selectedWarehouse={selectedWarehouse}
                warehouses={warehouses}
              />
            </Stack>
            <Stack direction="row">
              <Select
                placeholder=""
                width="120px"
                display="flex"
                justifyContent="center"
                borderRadius="50px"
                style={{ fontSize: "11px" }}
                onChange={(e) => handleSorting(e.target.value)}
              >
                <option value="1" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Newest Date
                </option>
                <option value="2" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Oldest Date
                </option>
              </Select>
              <Select
                // placeholder="-"
                width="120px"
                display="flex"
                justifyContent="center"
                borderRadius="50px"
                style={{ fontSize: "11px" }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Select>
            </Stack>
          </div>
          <div className="mt-6 flex flex-col justify-end max-w-5xl xl">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Product
                        </th>

                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Warehouse
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Stock In
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Stock Out
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Current Stock
                        </th>
                      </tr>
                    </thead>
                    {/* <tbody className="divide-y divide-gray-200 bg-white">
                      {ProductMap}
                    </tbody> */}
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {HistoryDataMap}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Pagination totalPages={totalPage} handlePageChange={handlePage} />
          <OrderDetailModal
            isDetailModalOpen={isDetailModalOpen}
            closeDetailModal={closeDetailModal}
            selectedTransaction={selectedTransaction}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default StockHistory;
