import React, { useEffect, useState } from "react";
import { Stack, Spinner, Select } from "@chakra-ui/react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { transactionData } from "../../features/transactionSlice";
import moment from "moment";
import Pagination from "../../components/admin/Pagination";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import OrderSearch from "../../components/admin/OrderSearch";
import OrderWarehouseDropdown from "../../components/admin/OrderWarehouseDropdown";
import ProductCategoryDropdown from "../../components/admin/ProductCategoryDropdown";

const SalesReport = () => {
  const value = useSelector((state) => state.transactionSlice.value);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transaction, setTransaction] = useState(null);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [order, setOrder] = useState("product_name");
  const [sort, setSort] = useState("ASC");
  const user = useSelector((state) => state.userSlice);
  console.log(user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([]);

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

  const url = "/transaction/data";
  const getTransactionData = async () => {
    try {
      let selectWarehouse;
      if (user.id_warehouse) {
        selectWarehouse = user.id_warehouse;
      } else {
        selectWarehouse = selectedWarehouse;
      }
      let result = await api.get(url, {
        params: {
          page,
          invoiceNumber,
          role: user.role,
          userId: user.id,
          warehouse: selectWarehouse,
        },
      });
      console.log(result);
      setTransaction(result.data.data);
      dispatch(transactionData(result.data.data));
      setTotalPage(result.data.totalPages);
      setTotalPrice(result.data.total_price);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/data");
      console.log(response.data);
      setWarehouses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await api.get("/category");
      console.log(response.data.result);
      setCategory(response.data.result);
    } catch (error) {
      console.error(error);
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
    getTransactionData();
  }, [page, invoiceNumber, selectedWarehouse]);

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
  };

  const handleSearch = (e) => {
    setInvoiceNumber(e.target.value);
    setCurrentPage(0);
    getTransactionData();
  };

  const handleWarehouseChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    if (user.role === "adminWarehouse") {
      setSelectedWarehouse(user.id_warehouse);
    } else {
      setSelectedWarehouse(selectedValue);
    }
  };
  const handleCategoryChange = (event) => {
    const selectedCategoryValue = event.target.value;
    console.log(selectedCategoryValue);
    setSelectedCategory(selectedCategoryValue);
  };

  const handleSorting = (value) => {
    if (value === "1") {
      setOrder("product_name");
      setSort("DESC");
    } else if (value === "2") {
      setOrder("price");
      setSort("ASC");
    } else if (value === "3") {
      setOrder("price");
      setSort("DESC");
    } else {
      setOrder("product_name");
      setSort("ASC");
    }
  };

  const transactionMap = value?.map((el, index) => {
    const date = el.transaction_date;
    const formattedDate = moment(date).format("DD MMMM YYYY");
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.invoice_number}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {formattedDate}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.Warehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <button
            onClick={() => handleViewOrderDetail(el.id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Detail
          </button>
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {`Rp ${el.total_price.toLocaleString()}`}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <Stack
            direction="row"
            spacing={0}
            display="flex"
            alignContent="center"
          ></Stack>
        </td>
      </tr>
    );
  });

  return (
    <div className={` ${paddingLeft}  py-10 items-center`}>
      {value ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Sales Report
            </h1>
            <Stack direction={"row"} className="flex gap-3 pb-3 pt-5">
              <OrderSearch
                handleSearch={handleSearch}
                invoiceNumber={invoiceNumber}
              />
              <OrderWarehouseDropdown
                user={user}
                handleWarehouseChange={handleWarehouseChange}
                selectedWarehouse={selectedWarehouse}
                warehouses={warehouses}
              />
              <ProductCategoryDropdown
                // user={user}
                handleCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                category={category}
              />
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
                <option value="3" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Price low - high
                </option>
                <option value="3" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Price high - low
                </option>
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
                          Invoice Number
                        </th>

                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Transaction Date
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Transaction Status
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
                          Detail
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {transactionMap}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan="5"
                          className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-semibold text-left text-gray-900"
                        >
                          Total Transaction :
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 font-bold">
                          {`Rp ${totalPrice.toLocaleString()}`}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <Pagination
                totalPages={totalPage}
                handlePageChange={handlePage}
              />
              <OrderDetailModal
                isDetailModalOpen={isDetailModalOpen}
                closeDetailModal={closeDetailModal}
                selectedTransaction={selectedTransaction}
              />
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default SalesReport;
