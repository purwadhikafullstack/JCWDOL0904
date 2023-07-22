import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { transactionItemData } from "../../features/transactionItemSlice";
import moment from "moment";
import OrderWarehouseDropdown from "../../components/admin/OrderWarehouseDropdown";
import ProductSearch from "../../components/admin/ProductSearch";
import SalesReportRender from "../../components/SalesReport/SalesReportRender";
import Alert from "../../components/SwallAlert";
import Swal from "sweetalert2";

const SalesReport = () => {
  const userData = useSelector((state) => state.userSlice);
  const itemValue = useSelector((state) => state.transactionItemSlice.value);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionByMonth, setTransactionByMonth] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [sort, setSort] = useState("DESC");
  const user = useSelector((state) => state.userSlice);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const dispatch = useDispatch();

  const urlProduct = "/transaction/product";
  const getAllReport = async () => {
    try {
      const startDate = selectedDateRange
        ? moment(selectedDateRange.startDate).format("YYYY-MM-DD HH:mm:ss")
        : null;
      const endDate = selectedDateRange
        ? moment(selectedDateRange.endDate).format("YYYY-MM-DD HH:mm:ss")
        : null;
      const response = await api.get(urlProduct, {
        params: {
          idWarehouse: selectedWarehouse,
          productSearch,
          adminWarehouse: userData.id_warehouse,
          selectedCategory,
          page,
          order,
          sort,
          startDate,
          endDate,
        },
      });
      dispatch(transactionItemData(response.data.result));
      setTotalPage(response.data.totalPage);
      setPage(response.data.page);
      setTransactionByMonth(response.data.totalPriceFiltered);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
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
  const fetchCategory = async () => {
    try {
      const response = await api.get("/category");
      setCategory(response.data.result);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "fail to get category!",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
    }
  };
  const handlePage = (event) => {
    setPage(event.selected);
  };
  useEffect(() => {
    fetchWarehouses();
  }, []);
  useEffect(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    getAllReport();
  }, [
    page,
    productSearch,
    selectedWarehouse,
    selectedCategory,
    selectedMonth,
    sort,
    order,
    selectedDateRange,
  ]);
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };
  const handleCategoryChange = (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);
  };
  const handleSorting = (value) => {
    if (value === "1") {
      setOrder("createdAt");
      setSort("DESC");
    } else if (value === "2") {
      setOrder("createdAt");
      setSort("ASC");
    } else if (value === "3") {
      setOrder("price");
      setSort("ASC");
    } else {
      setOrder("price");
      setSort("DESC");
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
  const handleWarehouseChange = (event) => {
    const selectedValue = event.target.value;
    if (user.role === "adminWarehouse") {
      setSelectedWarehouse(user.id_warehouse);
    } else {
      setSelectedWarehouse(selectedValue);
    }
  };
  const ProductMap = itemValue?.map((pEl) => {
    const date = pEl.Transaction.transaction_date;
    const formattedDate = moment(date).format("DD MMMM YYYY");
    return (
      <tr key={pEl.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {pEl.Product.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {formattedDate}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {pEl.Transaction.Warehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {pEl.category}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {`Rp ${pEl.price.toLocaleString()}`}
        </td>
      </tr>
    );
  });

  return (
    <>
      <SalesReportRender
        itemValue={itemValue}
        ProductSearch={ProductSearch}
        setProductSearch={setProductSearch}
        productSearch={productSearch}
        OrderWarehouseDropdown={OrderWarehouseDropdown}
        user={user}
        setSelectedWarehouse={handleWarehouseChange}
        selectedWarehouse={selectedWarehouse}
        warehouses={warehouses}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        category={category}
        handleSorting={handleSorting}
        selectedDateRange={selectedDateRange}
        handleDateRangeReset={handleDateRangeReset}
        ProductMap={ProductMap}
        totalPrice={totalPrice}
        handleDateRangeChange={handleDateRangeChange}
        transactionByMonth={transactionByMonth}
        totalPage={totalPage}
        handlePage={handlePage}
        isDetailModalOpen={isDetailModalOpen}
        closeDetailModal={closeDetailModal}
        selectedTransaction={selectedTransaction}
      />
    </>
  );
};
export default SalesReport;
