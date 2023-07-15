import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";
import {
  Button,
  Image,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import "./style/ProductDetail.css";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const navigation = useNavigate();
  const [product, setProduct] = useState({});
  const [stock, setStock] = useState(0);
  const userLogin = useSelector((state) => state.userSlice);

  useEffect(() => {
    const idProduct = localStorage.getItem("idProduct");
    if (idProduct && parseInt(idProduct) > 0) {
      getOneProduct(JSON.parse(idProduct));
      window.scrollTo(0, 0);
    } else {
      navigation("/home");
    }
  }, []);

  const getOneProduct = async (idP) => {
    try {
      const result = await api.post("/product/detail", { idP });
      console.log(result.data);
      setStock(result.data.stock);
      setProduct(result.data.productById);
    } catch (error) {}
  };

  let productId = JSON.parse(localStorage.getItem("idProduct"));
  let addToCart = async (e) => {
    const token = JSON.parse(localStorage.getItem("auth"));
    console.log(token);
    e.preventDefault();
    if (!localStorage.getItem("auth")) {
      Swal.fire({
        title: "Attention!",
        text: "you are not logged in yet, please login to do transactions and edit your profile",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
      navigation("/");
    } else {
      try {
        await api.post(
          `/cart`,
          {
            productId,
            quantity: 1,
          },
          {
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        navigation("/cart");
      } catch (error) {}
    }
  };

  return (
    <div style={{ paddingTop: "68px" }}>
      <div
        className="con-product-detail"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="wrap-product-detail">
          <div className="con-info">
            <div className="flex w-full items-center justify-center p-2">
              <h1
                style={{
                  padding: "10px",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                {product.product_name}
              </h1>
            </div>
            <section aria-labelledby="information-heading">
              <div className="flex items-center">
                <h1 className="price-detail">Price :</h1>
                <p className="num-price-detail">Rp.{product.price}</p>
              </div>

              <div className="flex w-full items-center justify-center p-2">
                <p className=" text-xs lg:text-12 text-left">
                  {product.description}
                </p>
              </div>

              <div className="flex w-full items-center justify-center">
                <p className="">Product stock is {stock} piece</p>
              </div>
            </section>
            <div className="con-button-add">
              {stock !== 0 ? (
                <button
                  onClick={(e) => addToCart(e)}
                  type="submit"
                  className="flex w-full transition duration-300 ease-in-out items-center justify-center rounded-md border border-transparent bg-black py-3 px-8 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Add to cart
                </button>
              ) : (
                <Button
                  isLoading
                  className="button-add"
                  spinner={<BeatLoader size={8} color="black" />}
                ></Button>
              )}
            </div>
          </div>
          <Image
            src={product.product_image}
            alt={product.product_image}
            className=""
          />
        </div>
        <div>
          <TableContainer
            className="con-table-info"
            padding="20px"
            backgroundColor="#F9FAFB"
            marginTop="20px"
            borderRadius="20px"
          >
            <Table variant="striped" colorScheme="gray">
              <Tbody>
                <Tr>
                  <Td>CPU Speed</Td>
                  <Td>{product.cpu_speed}</Td>
                </Tr>
                <Tr>
                  <Td>CPU Type</Td>
                  <Td>{product.cpu_type}</Td>
                </Tr>
                <Tr>
                  <Td>Size</Td>
                  <Td>{product.size}</Td>
                </Tr>
                <Tr>
                  <Td>Resolution</Td>
                  <Td>{product.resolution}</Td>
                </Tr>
                <Tr>
                  <Td>Color Depth</Td>
                  <Td>{product.colorDept}</Td>
                </Tr>
                <Tr>
                  <Td>RAM</Td>
                  <Td>{product.ram}</Td>
                </Tr>
                <Tr>
                  <Td>Storage</Td>
                  <Td>{product.storage}</Td>
                </Tr>
                <Tr>
                  <Td>Weight</Td>
                  <Td>{product.weight_g}</Td>
                </Tr>
                <Tr>
                  <Td>Battery Capacity</Td>
                  <Td>{product.battery}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
