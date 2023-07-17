import {
  Card,
  CardBody,
  Divider,
  Text,
  Heading,
  Stack,
  Image,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/style/Homepage.css";

const ProductsHome = ({ products }) => {
  const navigation = useNavigate();
  const handleToDetail = (value) => {
    localStorage.setItem("idProduct", JSON.stringify(value));
    navigation("/detail");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
      >
        {products?.map((el) => {
          return (
            <GridItem
              key={el.id}
              onClick={() => handleToDetail(el.id)}
              className="con-cards"
            >
              <Card
                cursor="pointer"
                width="200px"
                height="330px"
                className="bg-white hover:bg-gray-200"
              >
                <CardBody>
                  <Image
                    src={`${el.product_image}`}
                    alt={`${el.product_name}`}
                    borderRadius="lg"
                    width="150px"
                    height="150px"
                  />
                  <Stack mt="6" spacing="3" alignItems="center">
                    <Heading
                      maxWidth="150px"
                      noOfLines={2}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontSize="12px"
                      className="text-center"
                    >
                      {el.product_name}
                    </Heading>
                    <Text
                      noOfLines={2}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontSize="12px"
                      className="text-center"
                    >
                      {el.description}
                    </Text>
                    <Text fontSize="sm">
                      Price: Rp.{el.price.toLocaleString("id-ID")}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default ProductsHome;
