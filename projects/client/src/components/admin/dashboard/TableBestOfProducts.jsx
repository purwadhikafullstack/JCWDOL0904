import {
  Image,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";

const TableBestOfProducts = (props) => {
  return (
    <>
      <TableContainer borderRadius="20px">
        <Table>
          <Tbody>
            {props.props.product.length > 0 ? (
              props.props.product.map((el, index) => {
                return (
                  <Tr key={index} background="white">
                    <Td width="50px" justifyItems="center">
                      <Image
                        minWidth="40px"
                        maxWidth="80px"
                        src={`${process.env.REACT_APP_API_BASE}/${el.product_image}`}
                      />
                    </Td>
                    <Td width="500px">
                      <Text>{el.product_name}</Text>
                      <Progress value={el.product_sold} colorScheme="gray" />
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
    </>
  );
};

export default TableBestOfProducts;
