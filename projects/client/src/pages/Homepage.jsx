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
import ProductsHome from "../components/ProductsHome";
import ReactPaginate from "react-paginate";
import Carousel from "../components/Carousel";
import "./style/Homepage.css";
import { api } from "../API/api";
import UserIsNotLogin from "../components/UserIsNotLogin";

const Homepage = () => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState("product_name");
  const [isLogin, SetIsLogin] = useState(false);

  const [products, setProducts] = useState([]);

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

  // const getUserData = async () => {
  //   const id = JSON.parse(localStorage.getItem("idUser"));
  //   // console.log(id);
  //   if (!id) SetIsLogin(false);
  //   else {
  //     await api
  //       .post("/user/data", {
  //         id: id,
  //       })
  //       .then((result) => {
  //         console.log(result);
  //         SetIsLogin(true);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         SetIsLogin(false);
  //       });
  //   }
  // };

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
  }, [page, search, sort, order, isLogin]);

  return (
    <div style={{ minHeight: "150vh" }}>
      <Box
        paddingLeft="200px"
        paddingRight="200px"
        backgroundColor="black"
        maxW="100%"
      >
        <Carousel />
        {/* <Image src="https://images.samsung.com/is/image/samsung/assets/id/homepage/main-homepage/2023/web-01-hd01-DM-Series-kv-pc-1440x640.jpg?imwidth=1366" /> */}
      </Box>
      {isLogin ? null : <UserIsNotLogin />}
      <Tabs colorScheme="black">
        <TabList justifyContent="center" className="tab-list-home">
          <Tab onClick={() => fetchProducts(1)}>Smartphone</Tab>
          <Tab onClick={() => fetchProducts(2)}>Watch</Tab>
          <Tab onClick={() => fetchProducts(3)}>Tablet</Tab>
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
            {/* <Input placeholder='Search here.....' value={search} onChange={(e) => setSearch(e.target.value)} /> */}
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
          <TabPanel
            display="flex"
            flexDirection="column"
            justifyContent="center"
            maxWidth="100%"
          >
            <ProductsHome products={products} category={1} />
          </TabPanel>
          <TabPanel
            display="flex"
            flexDirection="row"
            justifyContent="center"
            maxWidth="100%"
          >
            <ProductsHome products={products} category={2} />
          </TabPanel>
          <TabPanel
            display="flex"
            flexDirection="row"
            justifyContent="center"
            maxWidth="100%"
          >
            <ProductsHome products={products} category={3} />
          </TabPanel>
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
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </div>
  );
};

export default Homepage;
