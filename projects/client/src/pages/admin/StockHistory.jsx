import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Pagination from "../../components/admin/Pagination";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import { stockHistoryData } from "../../features/stockHistorySlice";
import StockHistoryRender from "../../components/StockHistory/stockhistoryrender";

const StockHistory = () => {
  const itemValue = useSelector((state) => state.transactionItemSlice.value);
  const stockHistoryValue = useSelector(
    (state) => state.stockHistorySlice.value
  );
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [sort, setSort] = useState("ASC");
  const user = useSelector((state) => state.userSlice);
  const [productSearch, setProductSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const dispatch = useDispatch();

  const urlHistory = "stock-history/history";
  const getHistoryData = async () => {
    try {
      let selectWarehouse;
      if (user.id_warehouse) {
        selectWarehouse = user.id_warehouse;
      } else {
        selectWarehouse = selectedWarehouse;
      }
      const startDate = selectedDateRange
        ? moment(selectedDateRange.startDate).format("YYYY-MM-DD HH:mm:ss")
        : null;
      const endDate = selectedDateRange
        ? moment(selectedDateRange.endDate).format("YYYY-MM-DD HH:mm:ss")
        : null;
      let response = await api.get(urlHistory, {
        params: {
          page: currentPage,
          userId: user.id,
          productSearch,
          role: user.role,
          warehouse: selectWarehouse,
          sort,
          order,
          startDate,
          endDate,
        },
      });
      setTotalPage(response.data.totalPage);
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
    selectedDateRange,
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

  const handleSorting = (value) => {
    if (value === "1") {
      setOrder("createdAt");
      setSort("DESC");
    } else {
      setOrder("CreatedAt");
      setSort("ASC");
    }
  };

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange({
      startDate: dates[0],
      endDate: dates[1],
    });
    setSelectedMonth("");
  };

  const handleDateRangeReset = () => {
    setSelectedDateRange(null);
    setSelectedMonth("");
  };

  const HistoryDataMap = stockHistoryValue?.map((historyValue) => {
    const date = historyValue.createdAt;
    const formattedDate = moment(date).format("DD MMMM YYYY");
    const stockOut = historyValue.status === "in" ? "-" : historyValue.status;
    const stockIn = historyValue.status === "out" ? "-" : historyValue.status;
    return (
      <tr key={historyValue.id}>
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
    <>
      <StockHistoryRender
        itemValue={itemValue}
        setProductSearch={setProductSearch}
        productSearch={productSearch}
        user={user}
        setSelectedWarehouse={setSelectedWarehouse}
        warehouses={warehouses}
        handleSorting={handleSorting}
        selectedDateRange={selectedDateRange}
        handleDateRangeChange={handleDateRangeChange}
        handleDateRangeReset={handleDateRangeReset}
        HistoryDataMap={HistoryDataMap}
        Pagination={Pagination}
        totalPage={totalPage}
        handlePage={handlePage}
        OrderDetailModal={OrderDetailModal}
        isDetailModalOpen={isDetailModalOpen}
        closeDetailModal={closeDetailModal}
        selectedTransaction={selectedTransaction}
      />
    </>
  );
};

export default StockHistory;
