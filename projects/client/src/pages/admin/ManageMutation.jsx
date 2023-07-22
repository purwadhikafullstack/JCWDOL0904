import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { api } from "../../API/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "../../components/admin/Pagination";
import TabManageMutation from "../../components/admin/manageMutation/TabManageMutation";
import Swal from "sweetalert2";

const ManageMutation = () => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState("product_name");
  const [products, setProducts] = useState([]);

  const navigation = useNavigate();
  const ReduxCategory = useSelector((state) => state.categorySlice.value);

  const fetchProducts = async (category) => {
    setCategory(category);
    await api
      .get("/product/all", {
        params: {
          search,
          page,
          order,
          sort,
          category,
          site: "home",
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Oops, something went wrong!",
          icon: "error",
        });
        navigation("/dashboard");
      });
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
  const handlePageClick = (event) => {
    setPage(event.selected);
  };
  useEffect(() => {
    fetchProducts(category);
  }, [page, search, sort, order]);
  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <button
        className="mt-6 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => navigation("/mutation-list")}
      >
        Back To Mutation List
      </button>

      <TabManageMutation
        Input={Input}
        ReduxCategory={ReduxCategory}
        products={products}
        search={search}
        setSearch={setSearch}
        fetchProducts={fetchProducts}
        handleSorting={handleSorting}
      />

      <Pagination totalPages={totalPage} handlePageChange={handlePageClick} />
    </div>
  );
};

export default ManageMutation;
