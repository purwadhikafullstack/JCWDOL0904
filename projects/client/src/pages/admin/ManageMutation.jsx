import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Image,
  Input,
  Select,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import ProductsHome from "../../components/ProductsHome";
import ReactPaginate from "react-paginate";
// import "./style/Homepage.css";
import { api } from "../../API/api";
import ProductsAdmin from "../../components/admin/ProductsAdmin";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const ManageMutation = () => {
  const [coba, setCoba] = useState("hallo");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState("product_name");
  const [products, setProducts] = useState([]);
  const [isSmallerThan401] = useMediaQuery("(max-width: 767px)");

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
        console.log(res.data);
        setProducts(res.data.data);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
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
    // getUserData();
    fetchProducts(category);
    // console.log(isLogin);
  }, [page, search, sort, order]);

  useEffect(() => {
    console.log(coba);
  }, [coba]);

  return (
    <div className={isSmallerThan401 ? null : "pl-72 pr-8"}>
      <button
        className="mt-6 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => navigation("/mutation-list")}
      >
        Back To Mutation List
      </button>

      <Tabs colorScheme="black" isLazy variant="enclosed">
        <TabList
          className="tab-list-home"
          paddingTop="10px"
          overflowX="scroll"
          overflowY="clip"
        >
          {ReduxCategory.map((el) => {
            return el.category !== "no category" ? (
              <Tab
                key={el.id}
                onClick={() => fetchProducts(el.id)}
                fontSize="12px"
              >
                {el.category}
              </Tab>
            ) : null;
          })}
          {ReduxCategory.map((el) => {
            return el.category === "no category" ? (
              <Tab
                key={el.id}
                onClick={() => fetchProducts(el.id)}
                fontSize="12px"
              >
                {el.category}
              </Tab>
            ) : null;
          })}
        </TabList>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Stack
            flexDirection="column"
            alignItems="center"
            className="con-category"
          >
            <InputGroup>
              <InputRightElement
                pointerEvents="none"
                children={<SearchIcon color="#B9BAC4" />}
              />
              <Input
                placeholder="Search here....."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="50px"
              />
            </InputGroup>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text fontSize="12px" width="50px">
                Sort By:
              </Text>
              <Select
                placeholder="By name A~Z"
                width="120px"
                display="flex"
                justifyContent="center"
                borderRadius="50px"
                style={{ fontSize: "11px" }}
                onChange={(e) => handleSorting(e.target.value)}
              >
                <option value="1" style={{ fontSize: "10px", borderRadius: 0 }}>
                  By name Z~A
                </option>
                <option value="2" style={{ fontSize: "10px", borderRadius: 0 }}>
                  By price low~high
                </option>
                <option value="3" style={{ fontSize: "10px", borderRadius: 0 }}>
                  By price high~low
                </option>
              </Select>
            </div>
          </Stack>
        </div>

        <TabPanels
          className="card-con"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {ReduxCategory?.map((el) => {
            return el.category !== "no catagory" ? (
              <TabPanel
                display="flex"
                flexDirection="column"
                justifyContent="center"
                maxWidth="100%"
              >
                <ProductsAdmin products={products} category={el.id} />
              </TabPanel>
            ) : null;
          })}
          {ReduxCategory?.map((el) => {
            return el.category === "no catagory" ? (
              <TabPanel
                display="flex"
                flexDirection="column"
                justifyContent="center"
                maxWidth="100%"
              >
                <ProductsAdmin products={products} category={el.id} />
              </TabPanel>
            ) : null;
          })}
        </TabPanels>
      </Tabs>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPage}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="flex justify-center items-center mb-10"
        pageLinkClassName="px-2 py-1 rounded-md m-1"
        previousLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
        nextLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
        activeLinkClassName="px-2 py-1 bg-black text-white rounded-md m-1"
      />
    </div>
  );
};

export default ManageMutation;
