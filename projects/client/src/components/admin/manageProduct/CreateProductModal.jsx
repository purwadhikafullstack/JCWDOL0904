import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import ButtonCreateProduct from "./ButtonCreateProduct";
import DropDownCategoryMP from "./DropDownCategoryMP";

const CreateProductModal = (props) => {
  const fileInputRef = useRef(null);
  const buttonsCLicked = () => {
    fileInputRef.current.click();
    fileInputRef.current.value = null;
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="10px">
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                maxLength={40}
                type="email"
                value={props.product_name}
                onChange={(e) => props.setProduct_name(e.target.value)}
              />
              <FormLabel>Price (Rp)</FormLabel>
              <Input
                type="number"
                value={props.price}
                onChange={(e) => props.setPrice(e.target.value)}
              />
              <FormLabel>Image (png)</FormLabel>
              <Button
                onClick={() => buttonsCLicked()}
                _hover={{ background: "grey" }}
                color="white"
                background="black"
              >
                {props.file ? props.file.name : "upload image"}
              </Button>
              <Input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={(e) => props.setProduct_image(e.target.files[0])}
              />
              <DropDownCategoryMP
                category={props.category}
                setCategory={props.setCategory}
                Allcategory={props.Allcategory}
              />
              <FormLabel>Cpu Speed</FormLabel>
              <Input
                type="text"
                value={props.cpu_speed}
                onChange={(e) => props.setCpu_speed(e.target.value)}
              />
              <FormLabel>Cpu Type</FormLabel>
              <Input
                type="text"
                value={props.cpu_type}
                onChange={(e) => props.setCpu_type(e.target.value)}
              />
              <FormLabel>Size</FormLabel>
              <Input
                type="text"
                value={props.size}
                onChange={(e) => props.setSize(e.target.value)}
              />
              <FormLabel>Resolution</FormLabel>
              <Input
                type="text"
                value={props.resolution}
                onChange={(e) => props.setResolution(e.target.value)}
              />
              <FormLabel>Color Dept</FormLabel>
              <Input
                type="text"
                value={props.colorDept}
                onChange={(e) => props.setColorDept(e.target.value)}
              />
              <FormLabel>Ram</FormLabel>
              <Input
                type="text"
                value={props.ram}
                onChange={(e) => props.setRam(e.target.value)}
              />
              <FormLabel>Storage</FormLabel>
              <Input
                type="text"
                value={props.storage}
                onChange={(e) => props.setStorage(e.target.value)}
              />
              <FormLabel>Weight (g)</FormLabel>
              <Input
                type="number"
                value={props.weight_g}
                onChange={(e) => props.setWeight_g(e.target.value)}
              />
              <FormLabel>Battery</FormLabel>
              <Input
                type="text"
                value={props.battery}
                onChange={(e) => props.setbattery(e.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ButtonCreateProduct
            onClose={props.onClose}
            handleSubmit={props.handleSubmit}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProductModal;
