import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { SettingsIcon, DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditeProduct = ({ runFunction, category, productData, idProduct }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [product, setProduct] = useState(productData.product_name);
  const [img, setImg] = useState("");
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

  const [subdistrict, setSubsdistrict] = useState("");
  const [zip, setZip] = useState("");
  const [isLoad, setLoad] = useState(false);

  const handleSubmit = async () => {
    // console.log(props.wId);
    try {
      setLoad(true);
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
      console.log(response);
      runFunction();
      getAllCategory();

      Swal.fire({
        title: "Success",
        text: "Data has been updated!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      onClose();
      setLoad(false);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
      console.log(error.response.data.message);
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category/");
      console.log(response.data.result);
      const findCategory = response.data.result.find(
        (el) => el.id === productData.id_category
      );
      if (findCategory) {
        setAllCategory(response.data.result);
        setCategor(findCategory);
        setCategoryId(findCategory.id);
      }

      setAllCategory(response.data.result);

      // console.log(findCategory.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  useEffect(() => {
    console.log(categor);
  }, [categor]);

  return (
    <div className="flex align-middle">
      <IconButton
        onClick={role === "admin" ? onOpen : null}
        variant="link"
        color="black"
        backgroundColor="#F9FAFB"
        padding="10px"
        borderRadius="50px"
        _hover={{ backgroundColor: "black", color: "white" }}
        marginRight="10px"
        icon={<SettingsIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
              <FormLabel>Category</FormLabel>
              <Select
                placeholder={
                  categor.category ? categor.category : "select category"
                }
                defaultValue={categor.category ? categor.category : null}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  console.log(e.target.value);
                }}
              >
                {allCategory?.map((el) => {
                  // if (el.category !== categor.category) {
                  //   return (
                  //     <option key={el.id} value={el}>
                  //       {el.category}
                  //     </option>
                  //   );
                  // }
                  return (
                    <option
                      hidden={el.category === categor.category}
                      key={el.id}
                      value={el.id}
                    >
                      {el.category}
                    </option>
                  );
                })}
              </Select>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormLabel>Price</FormLabel>
              <Input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
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
                value={resolutioin}
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
              <FormLabel>weight (g)</FormLabel>
              <Input
                type="text"
                value={weight_g}
                onChange={(e) => setWeight_g(e.target.value)}
              />
              <FormLabel>Battery</FormLabel>
              <Input
                type="text"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isLoad ? (
              <Button variant="ghost" isLoading></Button>
            ) : (
              <Button
                variant="ghost"
                // leftIcon={<EditIcon />}
                backgroundColor="black"
                color="white"
                _hover={{ backgroundColor: "#3c3c3c" }}
                onClick={() => handleSubmit()}
              >
                Edit
              </Button>
            )}
            {/* <Button onClick={() => trying()}>coba</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditeProduct;
