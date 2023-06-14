import React from "react";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../API/api";
import {Button, Image, Stack} from "@chakra-ui/react";
import "./style/ProductDetail.css";

const ProductDetail = () => {
  const navigation = useNavigate();
  // const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const idProduct = localStorage.getItem("idProduct");
    if (idProduct && parseInt(idProduct) > 0) {
      getOneProduct(JSON.parse(idProduct));
    } else {
      navigation("/home");
    }
  }, []);

  const getOneProduct = async (idP) => {
    try {
      const result = await api.post("/product/detail", {idP});
      setStock(result.data.stock);
      setProduct({
        name: `${result.data.productById.product_name}`,
        price: `${result.data.productById.price}`,
        description: `${result.data.productById.description}`,
        imageSrc: `${result.data.productById.product_image}`,
        imageAlt: `${result.data.productById.product_image}`,
      });
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
        userId: 2,
        productId,
        quantity: 1,
      });
      navigation("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="con-product-detail">
        <div className="wrap-product-detail">
          <div className="con-info">
            <div>
              <h1
                style={{padding: "10px", fontSize: "30px", fontWeight: "bold"}}>
                {product.name}
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
              <button
                onClick={(e) => addToCart(e)}
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                Add to cart
              </button>
            </div>
          </div>
          <Image src={product.imageSrc} alt={product.imageAlt} className="" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
