import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useSelector } from "react-redux";

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
    try {
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
      console.log(response.data.result.id);
      initialStock(response.data.result.id);
      props.getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category/");
      // console.log(response.data.result);

      console.log(response.data.result);
      setAllCategory(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const initialStock = async (id) => {
    try {
      const response = await api.post("/product/stock-init", { id });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    // console.log(role);
  }, []);

  return (
    <div>
      {role === "admin" ? (
        <button
          className="mt-2 ml-52 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onOpen}
        >
          Create New Product
        </button>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="10px">
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="email"
                value={product_name}
                onChange={(e) => setProduct_name(e.target.value)}
              />
              <FormLabel>Price (Rp)</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FormLabel>Image (png)</FormLabel>
              <Input
                type="file"
                onChange={(e) => setProduct_image(e.target.files[0])}
              />
              <FormLabel>Category</FormLabel>
              <Select
                placeholder={category}
                defaultValue={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  console.log(e.target.value);
                }}
              >
                {Allcategory?.map((el) => {
                  return (
                    <option
                      // hidden={el.category === categor.category}
                      key={el.id}
                      value={el.id}
                    >
                      {el.category}
                    </option>
                  );
                })}
              </Select>

              <FormLabel>Cpu Speed</FormLabel>
              <Input
                type="text"
                value={cpu_speed}
                onChange={(e) => setCpu_speed(e.target.value)}
              />
              <FormLabel>Cpu Type</FormLabel>
              <Input
                type="text"
                value={cpu_type}
                onChange={(e) => setCpu_type(e.target.value)}
              />
              <FormLabel>Size</FormLabel>
              <Input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <FormLabel>Resolution</FormLabel>
              <Input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
              <FormLabel>Color Dept</FormLabel>
              <Input
                type="text"
                value={colorDept}
                onChange={(e) => setColorDept(e.target.value)}
              />
              <FormLabel>Ram</FormLabel>
              <Input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              />
              <FormLabel>Storage</FormLabel>
              <Input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              />
              <FormLabel>Weight (g)</FormLabel>
              <Input
                type="number"
                value={weight_g}
                onChange={(e) => setWeight_g(e.target.value)}
              />
              <FormLabel>Battery</FormLabel>
              <Input
                type="text"
                value={battery}
                onChange={(e) => setbattery(e.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                handleSubmit();
              }}
            >
              Create
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateNewProduct;
