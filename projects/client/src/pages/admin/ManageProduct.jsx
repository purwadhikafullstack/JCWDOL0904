import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Select,
  Stack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { api } from "../../API/api";
import AllProductManage from "../../components/admin/AllProductManage";
import CreateNewProduct from "../../components/admin/CreateNewProduct";
import { useDispatch, useSelector } from "react-redux";
import { AllCategory } from "../../features/categorySlice";
import Pagination from "../../components/admin/Pagination";

const ManageProduct = () => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState("product_name");
  const [products, setProducts] = useState([]);
  const ReduxCategory = useSelector((state) => state.categorySlice.value);
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
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        Alert({
          title: "Failed!",
          text: "Something went wrong",
          icon: "error",
        });
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
  const getAllCategory = async () => {
    try {
      const response = await api.get("/category");
      dispatch(AllCategory(response.data.result));
    } catch (error) {}
  };

  useEffect(() => {
    fetchProducts(category);
  }, [page, search, sort, order]);

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <div className="sm:flex-auto mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Manage product</h1>
      </div>
      <Tabs colorScheme="black" isLazy>
        <TabList
          paddingTop="10px"
          css={{
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #EDF2F7",
          }}
          overflowY="clip"
          whiteSpace="nowrap"
        >
          {ReduxCategory.map((el) => {
            return el.category !== "no category" ? (
              <Tab
                _selected={{ color: "white", bg: "black" }}
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
                _selected={{ color: "white", bg: "black" }}
                key={el.id}
                onClick={() => fetchProducts(el.id)}
                fontSize="12px"
              >
                {el.category}
              </Tab>
            ) : null;
          })}
        </TabList>
        <div className="mt-2 mx-5">
          <Stack direction="row" alignItems="center">
            <InputGroup>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Select
                placeholder="By name A~Z"
                display="flex"
                borderRadius="50px"
                onChange={(e) => handleSorting(e.target.value)}
              >
                <option value="1">By name Z~A</option>
                <option value="2">By price low~high</option>
                <option value="3">By price high~low</option>
              </Select>
            </div>
          </Stack>
          <CreateNewProduct getProducts={fetchProducts} />
        </div>
        <Stack>
          <TabPanels>
            <TabPanel>
              <AllProductManage
                products={products}
                category={category}
                runFunction={fetchProducts}
              />
            </TabPanel>
            {ReduxCategory?.map((el) => {
              return (
                <TabPanel key={el.id}>
                  <AllProductManage
                    products={products}
                    category={category}
                    runFunction={fetchProducts}
                  />
                </TabPanel>
              );
            })}
          </TabPanels>
        </Stack>
      </Tabs>
      <Pagination totalPages={totalPage} handlePageChange={handlePageClick} />
    </div>
  );
};

export default ManageProduct;
