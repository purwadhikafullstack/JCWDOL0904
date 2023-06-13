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
import UserIsNotLogin from "../components/UserIsNotLogin";

const ProductDetail = () => {
  const navigation = useNavigate();
  // const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [stock, setStock] = useState(0);
  const [isLogin, SetIsLogin] = useState(false);

  useEffect(() => {
    const idProduct = localStorage.getItem("idProduct");
    if (idProduct && parseInt(idProduct) > 0) {
      getOneProduct(JSON.parse(idProduct));
      window.scrollTo(0, 0);
    } else {
      navigation("/");
    }
    const id = JSON.parse(localStorage.getItem("auth"));
    if (!id || id < 1) SetIsLogin(false);
    else if (id) SetIsLogin(true);
  }, []);

  const getOneProduct = async (idP) => {
    try {
      const result = await api.post("/product/detail", { idP });
      console.log(result.data);
      setStock(result.data.stock);
      setProduct(result.data.productById);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  let productId = JSON.parse(localStorage.getItem("idProduct"));
  console.log(productId);

  // Add to cart
  let addToCart = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/cart/add`, {
        userId: 1,
        productId,
        quantity: 1,
      });
      navigation("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ paddingTop: "68px" }}>
      {isLogin ? null : <UserIsNotLogin />}
      <div
        className="con-product-detail"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="wrap-product-detail">
          <div className="con-info">
            <div>
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

              <div className="con-desc-text">
                <p className="desc-text">
                  {product.description} ankdawfbalwbfl
                  balwblabwflbawflaawfabnlwfnalfwbalwbfa fkwa f awbfoabfoia fa
                  wfoa foa o
                </p>
              </div>

              <div className="">
                <p className="">Product stock is {stock} piece</p>
              </div>
            </section>
            <div className="con-button-add">
              {isLogin ? (
                <button
                  onClick={(e) => addToCart(e)}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
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
              {/* <button
                onClick={(e) => addToCart(e)}
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Add to cart
              </button> */}
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
            <Table variant="simple" colorScheme="gray">
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
