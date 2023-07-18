import { SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import React from "react";

const EditeProductRender = (props) => {
  return (
    <>
      <div className="flex align-middle">
        <IconButton
          onClick={props.role === "admin" ? props.onOpen : null}
          variant="link"
          color="black"
          backgroundColor="#F9FAFB"
          padding="10px"
          borderRadius="50px"
          _hover={{ backgroundColor: "black", color: "white" }}
          marginRight="10px"
          icon={<SettingsIcon />}
        />

        <Modal isOpen={props.isOpen} onClose={props.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Product Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input
                  type="text"
                  value={props.product}
                  onChange={(e) => props.setProduct(e.target.value)}
                />
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder={
                    props.categor.category
                      ? props.categor.category
                      : "select category"
                  }
                  defaultValue={
                    props.categor.category ? props.categor.category : null
                  }
                  onChange={(e) => {
                    props.setCategoryId(e.target.value);
                  }}
                >
                  {props.allCategory?.map((el) => {
                    return (
                      <option
                        hidden={el.category === props.categor.category}
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
                  value={props.description}
                  onChange={(e) => props.setDescription(e.target.value)}
                />
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={props.price}
                  onChange={(e) => props.setPrice(e.target.value)}
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
                  value={props.resolutioin}
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
                <FormLabel>weight (g)</FormLabel>
                <Input
                  type="number"
                  value={props.weight_g}
                  onChange={(e) => props.setWeight_g(e.target.value)}
                />
                <FormLabel>Battery</FormLabel>
                <Input
                  type="text"
                  value={props.battery}
                  onChange={(e) => props.setBattery(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              {props.isLoad ? (
                <Button variant="ghost" isLoading></Button>
              ) : (
                <Button
                  variant="ghost"
                  backgroundColor="black"
                  color="white"
                  _hover={{ backgroundColor: "#3c3c3c" }}
                  onClick={() => props.handleSubmit()}
                >
                  Edit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default EditeProductRender;
