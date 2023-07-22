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
import ProductsAdmin from "../ProductsAdmin";

const TabManageMutation = (props) => {
  return (
    <>
      <Tabs colorScheme="black" isLazy variant="enclosed">
        <TabList
          className="tab-list-home"
          paddingTop="10px"
          overflowX="scroll"
          overflowY="clip"
        >
          {props.ReduxCategory.map((el) => {
            return el.category !== "no category" ? (
              <Tab
                key={el.id}
                onClick={() => props.fetchProducts(el.id)}
                fontSize="12px"
              >
                {el.category}
              </Tab>
            ) : null;
          })}
          {props.ReduxCategory.map((el) => {
            return el.category === "no category" ? (
              <Tab
                key={el.id}
                onClick={() => props.fetchProducts(el.id)}
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
              <Text fontSize="12px" width="50px"></Text>
              <Select
                placeholder="By name A~Z"
                width="120px"
                display="flex"
                justifyContent="center"
                style={{ fontSize: "11px" }}
                onChange={(e) => props.handleSorting(e.target.value)}
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
          {props.ReduxCategory?.map((el) => {
            return el.category !== "no catagory" ? (
              <TabPanel
                key={el.id}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                maxWidth="100%"
              >
                <ProductsAdmin products={props.products} category={el.id} />
              </TabPanel>
            ) : null;
          })}
          {props.ReduxCategory?.map((el) => {
            return el.category === "no catagory" ? (
              <TabPanel
                key={el.id}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                maxWidth="100%"
              >
                <ProductsAdmin products={props.products} category={el.id} />
              </TabPanel>
            ) : null;
          })}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabManageMutation;
