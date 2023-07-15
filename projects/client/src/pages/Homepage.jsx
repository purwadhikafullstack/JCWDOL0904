import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Carousel from "../components/Carousel";
import "./style/Homepage.css";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AllCategory } from "../features/categorySlice";
import Pagination from "../components/admin/Pagination";
import TabPanelHomeProduct from "../components/homepage/tabPanelHomeProduct";

const Homepage = () => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState("product_name");
  const [products, setProducts] = useState([]);

  const allCategory = useSelector((state) => state.categorySlice.value);
  const dispatch = useDispatch();

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
      .catch((err) => {});
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category", {
        params: {
          site: "home",
        },
      });
      dispatch(AllCategory(response.data.result));
    } catch (error) {}
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
    // getUserData();
    getAllCategory();
    fetchProducts(category);
    // console.log(isLogin);
  }, [page, search, sort, order]);

  return (
    <div style={{ minHeight: "150vh" }}>
      <Box backgroundColor="black" maxW="100%">
        <Carousel />
      </Box>
      <TabPanelHomeProduct
        allCategory={allCategory}
        handleSorting={handleSorting}
        fetchProducts={fetchProducts}
        setSearch={setSearch}
        products={products}
        search={search}
      />
      <Pagination totalPages={totalPage} handlePageChange={handlePageClick} />
    </div>
  );
};

export default Homepage;
