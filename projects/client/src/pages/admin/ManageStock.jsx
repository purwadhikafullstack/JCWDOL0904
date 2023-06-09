import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import EditeStock from "../../components/admin/EditeStock";
import { dataStock } from "../../features/stockSlice";
import DecreaseStock from "../../components/admin/DecreaseStock";
import Pagination from "../../components/admin/Pagination";
import { SearchIcon } from "@chakra-ui/icons";
import { AllCategory } from "../../features/categorySlice";

const ManageStock = () => {
  const warehouses = useSelector((state) => state.warehouseSlice.value);
  const allCatego = useSelector((state) => state.categorySlice.value);
  const [products, setProducts] = useState([]);
  const [ware, setWare] = useState(warehouses[0].id);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [stockFilter, setStockFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const AdminLogin = useSelector((state) => state.userSlice);

  const getProducts = async () => {
    try {
      console.log(stockFilter);
      const response = await api.get("/stock/all", {
        params: {
          ware,
          page,
          stockFilter,
          search,
          categoryFilter,
          sort,
        },
      });
      console.log(response);
      console.log(warehouses);
      setProducts(response.data.result);
      setTotalPage(response.data.totalPage);
      dispatch(dataStock(response.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category");
      console.log(response);
      dispatch(AllCategory(response.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (event) => {
    setPage(event.selected);
  };

  useEffect(() => {
    getProducts();
    getAllCategory();
    console.log(AdminLogin);
  }, [ware, page, stockFilter, search, categoryFilter, sort]);

  const stockValue = useSelector((state) => state.stockSlice.value);

  let count = 0;
  const product = stockValue?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          <Image src={`${el.product_image}`} height="40px" />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.Stocks[0].stock}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          <EditeStock
            product={el}
            stockNow={el.Stocks[0].stock}
            idStock={el.Stocks[0].id}
            runFunction={getProducts}
          />
          <DecreaseStock
            stockNow={el.Stocks[0].stock}
            idStock={el.Stocks[0].id}
            runFunction={getProducts}
          />
        </td>
      </tr>
    );
  });

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-2 mt-2">
        Manage Stock
      </h1>
      <Stack direction="row">
        <Select
          width="150px"
          marginBottom="5px"
          fontSize="13px"
          height="30px"
          disabled={AdminLogin.role === "admin" ? false : true}
          defaultValue={ware}
          onChange={(e) => setWare(e.target.value)}
          borderRadius="50px"
        >
          {warehouses?.map((el) => {
            return (
              <option key={el.id} value={el.id}>
                {el.warehouse}
              </option>
            );
          })}
        </Select>
        <Select
          width="150px"
          marginBottom="5px"
          fontSize="13px"
          height="30px"
          defaultValue={stockFilter}
          borderRadius="50px"
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value={null}>All stock</option>
          <option value="1">stock = 0</option>
          <option value="2">0 &lt; stock &lt; 100</option>
          <option value="3">100 &lt; stock</option>
        </Select>
      </Stack>
      <Stack direction="row">
        <Select
          width="150px"
          marginBottom="5px"
          fontSize="13px"
          height="30px"
          value={sort}
          borderRadius="50px"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="ASC">Stock less - more</option>
          <option value="DESC">Stock more - less</option>
        </Select>
        <Select
          width="150px"
          marginBottom="5px"
          fontSize="13px"
          height="30px"
          defaultValue={categoryFilter}
          borderRadius="50px"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value={""}>All category</option>
          {allCatego?.map((el) => {
            return (
              <option key={el.id} value={el.id}>
                {el.category}
              </option>
            );
          })}
        </Select>
      </Stack>

      <InputGroup marginTop="5px">
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="#B9BAC4" />}
        />
        <Input
          placeholder="Search product here....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          borderRadius="50px"
        />
      </InputGroup>
      <div className="mt-5 mb-6 flex flex-col justify-end  xl">
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
                      Product Image
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {product}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination totalPages={totalPage} handlePageChange={handlePageChange} />
    </div>
  );
};

export default ManageStock;
