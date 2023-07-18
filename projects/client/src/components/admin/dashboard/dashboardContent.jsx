import {
  Card,
  CardBody,
  Grid,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import TableBestOfProducts from "./TableBestOfProducts";
import DataAdminDashboard from "./DataAdminDashboard";

const DashboardContent = (props) => {
  return (
    <>
      <Stack>
        <DataAdminDashboard props={props} />
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
                  <Text>{props.tCount} transaction is ongoing</Text>
                </Stack>
              </CardBody>
            </Card>
            <Card background="aquamarine">
              <CardBody>
                <Stack>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Mutation
                  </h1>
                  <Text>{props.mCount} mutation / migration is ongoing</Text>
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
                disabled={props.adminData.role === "admin" ? false : true}
                value={props.warehouses}
                onChange={(e) => props.setWarehouses(e.target.value)}
              >
                {props.adminData.id_warehouse ? null : (
                  <option value={null}> All Warehouse</option>
                )}
                {props.warehouse?.map((el) => {
                  if (!props.adminData.id_warehouse) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  } else if (props.adminData.id_warehouse === el.id) {
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
            <TableBestOfProducts props={props} />
          </CardBody>
        </Card>
        <Card shadow="lg" background="white" marginTop="10px">
          <CardBody>
            <Stack marginY="10px" alignItems="center">
              <h1 className="text-xl font-semibold text-gray-900 min-w-fit">
                Top 3 Best Customer of the Month
              </h1>
              <Select
                disabled={props.adminData.role === "admin" ? false : true}
                value={props.warehouseprice}
                onChange={(e) => props.setWarehousePrice(e.target.value)}
              >
                {props.adminData.id_warehouse ? null : (
                  <option value={null}> All Warehouse</option>
                )}
                {props.warehouse?.map((el) => {
                  if (!props.adminData.id_warehouse) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.warehouse}
                      </option>
                    );
                  } else if (props.adminData.id_warehouse === el.id) {
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
                  {props.pCount.length > 0 ? (
                    props.pCount.map((el, index) => {
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
    </>
  );
};

export default DashboardContent;
