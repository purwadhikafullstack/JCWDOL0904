import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useSelector } from "react-redux";
import Alert from "../SwallAlert";
import CreateProductModal from "./manageProduct/CreateProductModal";
import Swal from "sweetalert2";

const CreateNewProduct = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [product_name, setProduct_name] = useState("");
  const [price, setPrice] = useState("");
  const [file, setProduct_image] = useState(null);
  const [cpu_speed, setCpu_speed] = useState("");
  const [cpu_type, setCpu_type] = useState("");
  const [size, setSize] = useState("");
  const [resolution, setResolution] = useState("");
  const [colorDept, setColorDept] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [weight_g, setWeight_g] = useState("");
  const [battery, setbattery] = useState("");
  const [description, setDescription] = useState("");
  const [Allcategory, setAllCategory] = useState([]);
  const [category, setCategory] = useState("Select category");
  const { role } = useSelector((state) => state.userSlice);
  const handleSubmit = async () => {
    console.log(file);
    try {
      if (!file) {
        return Alert({
          title: "Failed!",
          text: "Please insert product image",
          icon: "error",
        });
      } else if (price.length > 10) {
        return Alert({
          title: "Failed!",
          text: "price is too",
          icon: "error",
        });
      } else {
        const formData = new FormData();
        formData.append("product_name", product_name);
        formData.append("price", price);
        formData.append("file", file);
        formData.append("category", category);
        formData.append("cpu_speed", cpu_speed);
        formData.append("cpu_type", cpu_type);
        formData.append("size", size);
        formData.append("resolution", resolution);
        formData.append("colorDept", colorDept);
        formData.append("ram", ram);
        formData.append("storage", storage);
        formData.append("weight_g", weight_g);
        formData.append("battery", battery);
        formData.append("description", description);
        const response = await api.post("/product/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          title: "Success",
          text: "Product has been created!",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setProduct_image(null);
        initialStock(response.data.result.id);
        props.getProducts();
      }
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  const getAllCategory = async () => {
    try {
      const response = await api.get("/category/");
      setAllCategory(response.data.result);
      if (response.data.result[0].id) {
        setCategory(response.data.result[0].id);
      }
    } catch (error) {}
  };
  const initialStock = async (id) => {
    try {
      const response = await api.post("/product/stock-init", { id });
      console.log(response);
    } catch (error) {}
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div>
      {role === "admin" ? (
        <button
          className="mt-2 ml-2 w-40 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onOpen}
        >
          Create New Product
        </button>
      ) : null}

      <CreateProductModal
        isOpen={isOpen}
        onClose={onClose}
        price={price}
        setPrice={setPrice}
        product_name={product_name}
        setProduct_name={setProduct_name}
        file={file}
        setProduct_image={setProduct_image}
        cpu_speed={cpu_speed}
        setCpu_speed={setCpu_speed}
        cpu_type={cpu_type}
        setCpu_type={setCpu_type}
        size={size}
        setSize={setSize}
        resolution={resolution}
        setResolution={setResolution}
        colorDept={colorDept}
        setColorDept={setColorDept}
        ram={ram}
        setRam={setRam}
        storage={storage}
        setStorage={setStorage}
        weight_g={weight_g}
        setWeight_g={setWeight_g}
        description={description}
        setDescription={setDescription}
        Allcategory={Allcategory}
        setAllCategory={setAllCategory}
        category={category}
        setCategory={setCategory}
        role={role}
        battery={battery}
        setbattery={setbattery}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default CreateNewProduct;
