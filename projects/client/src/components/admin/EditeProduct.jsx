import React, { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import EditeProductRender from "./EditProduct/EditeProductRender";

const EditeProduct = ({ runFunction, category, productData, idProduct }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [product, setProduct] = useState(productData.product_name);
  const [description, setDescription] = useState(productData.description);
  const [price, setPrice] = useState(productData.price);
  const [categor, setCategor] = useState(productData.id_category);
  const [cpu_speed, setCpu_speed] = useState(productData.cpu_speed);
  const [cpu_type, setCpu_type] = useState(productData.cpu_type);
  const [size, setSize] = useState(productData.size);
  const [resolutioin, setResolution] = useState(productData.resolution);
  const [colorDept, setColorDept] = useState(productData.colorDept);
  const [ram, setRam] = useState(productData.ram);
  const [storage, setStorage] = useState(productData.storage);
  const [weight_g, setWeight_g] = useState(productData.weight_g);
  const [battery, setBattery] = useState(productData.battery);
  const [allCategory, setAllCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const { role } = useSelector((state) => state.userSlice);

  const [isLoad, setLoad] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoad(true);
      if (price.length > 10) {
        Swal.fire({
          title: "Error!",
          text: "price too long!",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "black",
        });
        onClose();
      } else {
        let response = await api.patch("/product/update-data", {
          id: idProduct,
          product_name: product,
          description,
          price: parseInt(price),
          categor: parseInt(categoryId),
          cpu_speed,
          cpu_type,
          size,
          resolutioin,
          colorDept,
          ram,
          storage,
          weight_g,
          battery,
        });
        onClose();
        setLoad(false);
        runFunction(category);
        getAllCategory();

        Swal.fire({
          title: "Success",
          text: "Data has been updated!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "black",
        });
      }
      setLoad(false);
    } catch (error) {
      onClose();
      setLoad(false);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category/");
      const findCategory = response.data.result.find(
        (el) => el.id === productData.id_category
      );
      if (findCategory) {
        setAllCategory(response.data.result);
        setCategor(findCategory);
        setCategoryId(findCategory.id);
      }

      setAllCategory(response.data.result);
    } catch (error) {}
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <EditeProductRender
        role={role}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        product={product}
        setProduct={setProduct}
        categor={categor}
        setCategor={setCategor}
        allCategory={allCategory}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        cpu_speed={cpu_speed}
        setCpu_speed={setCpu_speed}
        cpu_type={cpu_type}
        setCpu_type={setCpu_type}
        size={size}
        setSize={setSize}
        resolutioin={resolutioin}
        setResolution={setResolution}
        colorDept={colorDept}
        setColorDept={setColorDept}
        ram={ram}
        setRam={setRam}
        storage={storage}
        setStorage={setStorage}
        weight_g={weight_g}
        setWeight_g={setWeight_g}
        battery={battery}
        setBattery={setBattery}
        isLoad={isLoad}
        handleSubmit={handleSubmit}
        setCategoryId={setCategoryId}
      />
    </>
  );
};

export default EditeProduct;
