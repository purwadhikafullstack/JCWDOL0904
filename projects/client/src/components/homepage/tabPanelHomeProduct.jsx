import { SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import ProductsHome from "../ProductsHome";

const TabPanelHomeProduct = (props) => {
  return (
    <>
      <Tabs colorScheme="black" isLazy>
        <TabList
          css={{
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #EDF2F7",
          }}
          justifyContent="center"
          className="tab-list-home"
          overflowX="scroll"
          overflowY="clip"
          whiteSpace="nowrap"
        >
          {props.allCategory?.map((el) => {
            return (
              <Tab
                key={el.id}
                _selected={{ color: "white", bg: "black" }}
                onClick={() => props.fetchProducts(el.id)}
              >
                {el.category}
              </Tab>
            );
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
            alignItems="end"
            className="con-category"
          >
            <InputGroup>
              <InputRightElement
                pointerEvents="none"
                children={<SearchIcon color="#B9BAC4" />}
              />
              <Input
                placeholder="Search here....."
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
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
              <Select
                placeholder=" Name A-Z"
                width="120px"
                display="flex"
                justifyContent="center"
                style={{ fontSize: "11px" }}
                onChange={(e) => props.handleSorting(e.target.value)}
              >
                <option value="1" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Name Z-A
                </option>
                <option value="2" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Price low-high
                </option>
                <option value="3" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Price high-low
                </option>
              </Select>
            </div>
          </Stack>
        </div>

        <TabPanels
          className="card-con"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {props.allCategory?.map((el) => {
            return el.category !== "no category" ? (
              <TabPanel
                key={el.id}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                maxWidth="100%"
              >
                <ProductsHome products={props.products} category={el.id} />
              </TabPanel>
            ) : null;
          })}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabPanelHomeProduct;
