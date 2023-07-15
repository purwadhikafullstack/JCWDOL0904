import {
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  Image,
  List,
  ListIcon,
  ListItem,
  Progress,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AtSignIcon, StarIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { HomeIcon } from "@heroicons/react/24/outline";
import { api } from "../../API/api";

const Dashboard = () => {
  const [warehousePlace, setWarehousePlace] = useState("All Warehouse");
  const [warehouseprice, setWarehousePrice] = useState("All Warehouse");
  const [product, setProduct] = useState([]);
  const [tCount, setTCount] = useState(0);
  const [mCount, setMCount] = useState(0);
  const [pCount, setPCount] = useState([]);

  const [warehouses, setWarehouses] = useState("All Warehouse");
  const adminData = useSelector((state) => state.userSlice);
  const warehouse = useSelector((state) => state.warehouseSlice.value);
  useEffect(() => {
    const findWarehouse = warehouse.find((el) => {
      return adminData.id_warehouse === el.id;
    });
    if (findWarehouse) setWarehousePlace(findWarehouse.warehouse);
  }, [warehouse]);

  const getUserBuyer = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.post(
        "/dashboard/user-count",
        { warehouseprice },
        {
          headers: {
            Authorization: token,
            Accept: "appplication/json",
            "Content-Type": "application/json",
          },
        }
      );
      setPCount(response.data.userPrice);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getFavoriteProduct = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/product/favorite", {
        params: {
          warehouses,
        },
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setProduct(response.data.productFavoriteData);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountTransactionOngoing = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/dashboard/transaction-count", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setTCount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountMutatioinOngoing = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/dashboard/mutation-count", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setMCount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFavoriteProduct();
    getCountTransactionOngoing();
    getCountMutatioinOngoing();
  }, [warehouses, warehouseprice]);
  useEffect(() => {
    getUserBuyer();
  }, [warehouseprice]);
  let count = 0;
  return (
    <div className="min-h-screen px-7 py-5">
      <Stack>
        <Card shadow="lg" background="blackAlpha.100">
          <CardBody>
            <Stack direction="row" justifyContent="left" alignItems="center">
              <Box backgroundColor="white" padding="5px" borderRadius="50px">
                <Image
                  width="70px"
                  src={`${adminData.user_image}`}
                  borderRadius="50px"
                />
              </Box>
              <List alignItems="center" spacing={1}>
                <ListItem fontSize="13px">
                  <ListIcon as={AtSignIcon} boxSize="13px" />
                  {adminData.username}
                </ListItem>
                <ListItem fontSize="13px">
                  <ListIcon as={StarIcon} boxSize="13px" />
                  {adminData.role}
                </ListItem>
                <ListItem fontSize="13px">
                  <ListIcon as={HomeIcon} boxSize="15px" />
                  {warehousePlace}
                </ListItem>
              </List>
            </Stack>
            <h1 className="text-xl font-semibold text-gray-900 py-2">
              Hi, {adminData.username}. Welcome to the admin dashboard
            </h1>
          </CardBody>
        </Card>
        <Stack direction="row" marginY="10px">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 2fr)" }}
            gap={5}
            width="full"
          >
            <Card background="cyan.100">
              <CardBody>
                <Stack>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Transaction
                  </h1>
                  <Text>{tCount} transaction is ongoing</Text>
                </Stack>
              </CardBody>
            </Card>
            <Card background="aquamarine">
              <CardBody>
                <Stack>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Mutation
                  </h1>
                  <Text>{mCount} mutation / migration is ongoing</Text>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </Stack>

        <Card shadow="lg" background="white">
          <CardBody>
            <Stack marginY="10px" alignItems="center">
              <h1 className="text-xl font-semibold text-gray-900 min-w-fit">
                Top 3 Best Selling Products of the Month
              </h1>
              <Select
                disabled={adminData.role === "admin" ? false : true}
                value={warehouses}
                onChange={(e) => setWarehouses(e.target.value)}
              >
                {adminData.id_warehouse ? null : (
                  <option value={null}> All Warehouse</option>
                )}
                {warehouse?.map((el) => {
                  if (!adminData.id_warehouse) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  } else if (adminData.id_warehouse === el.id) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  }
                  return null;
                })}
              </Select>
            </Stack>
            <TableContainer borderRadius="20px">
              <Table>
                <Tbody>
                  {product.length > 0 ? (
                    product.map((el, index) => {
                      return (
                        <Tr key={index} background="white">
                          <Td width="50px" justifyItems="center">
                            <Image
                              minWidth="40px"
                              maxWidth="80px"
                              src={`${el.product_image}`}
                            />
                          </Td>
                          <Td width="500px">
                            <Text>{el.product_name}</Text>
                            <Progress
                              value={el.product_sold}
                              colorScheme="gray"
                            />
                          </Td>
                          <Td width="10px">{el.qty}</Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td>There is no product sold yet</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
        <Card shadow="lg" background="white" marginTop="10px">
          <CardBody>
            <Stack marginY="10px" alignItems="center">
              <h1 className="text-xl font-semibold text-gray-900 min-w-fit">
                Top 3 Best Customer of the Month
              </h1>
              <Select
                disabled={adminData.role === "admin" ? false : true}
                value={warehouseprice}
                onChange={(e) => setWarehousePrice(e.target.value)}
              >
                {adminData.id_warehouse ? null : (
                  <option value={null}> All Warehouse</option>
                )}
                {warehouse?.map((el) => {
                  if (!adminData.id_warehouse) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  } else if (adminData.id_warehouse === el.id) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  }
                  return null;
                })}
              </Select>
            </Stack>
            <TableContainer borderRadius="20px">
              <Table>
                <Tbody>
                  {pCount.length > 0 ? (
                    pCount.map((el, index) => {
                      return (
                        <Tr key={index} background="white">
                          <Td width="500px">
                            <Text>{el.username}</Text>
                          </Td>
                          <Td width="10px">
                            Rp.{parseInt(el.price).toLocaleString("id-ID")}
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td>There is no buyer yet</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Stack>
    </div>
  );
};

export default Dashboard;
