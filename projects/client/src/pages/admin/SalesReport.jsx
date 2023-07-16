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

const SalesReport = () => {
  const value = useSelector((state) => state.transactionSlice.value);
  const userData = useSelector((state) => state.userSlice);
  // console.log(value);
  const itemValue = useSelector((state) => state.transactionItemSlice.value);
  // console.log(itemValue);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionByMonth, setTransactionByMonth] = useState(0);
  const [transaction, setTransaction] = useState(null);
  const [product, setProduct] = useState(null);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [sort, setSort] = useState("ASC");
  const user = useSelector((state) => state.userSlice);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  // console.log(user);

  const dispatch = useDispatch();

  const urlProduct = "/transaction/product";
  const getAllReport = async () => {
    try {
      console.log(selectedMonth);
      const response = await api.get(urlProduct, {
        params: {
          idWarehouse: selectedWarehouse,
          productSearch,
          adminWarehouse: userData.id_warehouse,
          selectedCategory,
          page,
          adminWarehouse: userData.id_warehouse,
          selectedCategory,
          page,
          month: selectedMonth,
          order,
          sort,
        },
      });
      dispatch(transactionItemData(response.data.result));
      setTotalPage(response.data.totalPage);
      setPage(response.data.page);
      setTransactionByMonth(response.data.totalPriceFiltered);
      setTotalPrice(response.data.total_price);
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

  const fetchCategory = async () => {
    try {
      const response = await api.get("/category");
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
    getAllReport();
  }, [
    page,
    productSearch,
    selectedWarehouse,
    selectedCategory,
    selectedMonth,
    sort,
    order,
  ]);

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleViewOrderDetail = (idtrans) => {
    setSelectedTransaction(idtrans);
    setIsDetailModalOpen(true);
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
    <div className="mr-10 ml-10 py-10 items-center justify-center">
      {itemValue ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Sales Report
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
              <ProductCategoryDropdown
                handleCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                category={category}
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
                <option value="1" style={{ fontSize: "15px", borderRadius: 0 }}>
                  Newest Date
                </option>
                <option value="2" style={{ fontSize: "15px", borderRadius: 0 }}>
                  Oldest Date
                </option>
                <option value="3" style={{ fontSize: "15px", borderRadius: 0 }}>
                  Price low - high
                </option>
                <option value="4" style={{ fontSize: "15px", borderRadius: 0 }}>
                  Price high - low
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
          <div className="mt-6 flex flex-col justify-end xl">
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
                          Transaction Date
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
                          Category
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Item Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {ProductMap}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end xl">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <tfoot>
                      <tr>
                        <td
                          colSpan="6"
                          className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-semibold text-left text-gray-900"
                        >
                          ALLTransaction:
                        </td>
                        <td></td>
                        <td
                          className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-bold text-gray-900"
                          colSpan="5"
                        >
                          {`Rp ${parseInt(totalPrice).toLocaleString()}`}
                        </td>
                      </tr>
                    </tfoot>
                    <tfoot>
                      <tr>
                        <td
                          colSpan="2"
                          className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-semibold text-left text-gray-900"
                        >
                          Transaction Filtered:
                        </td>
                        <td></td>
                        <td
                          className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-bold text-right text-gray-900"
                          colSpan="4"
                        >
                          {`Rp ${parseInt(
                            transactionByMonth
                          ).toLocaleString()}`}
                        </td>
                      </tr>
                    </tfoot>
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

export default SalesReport;
