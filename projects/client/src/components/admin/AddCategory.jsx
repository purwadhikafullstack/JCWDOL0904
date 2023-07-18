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
  Input,
} from "@chakra-ui/react";

import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const AddCategory = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categor, setCategor] = useState("");
  const [isLoad, setLoad] = useState(false);

  const { role } = useSelector((state) => state.userSlice);

  const handleSubmit = async () => {
    try {
      setLoad(true);
      let response = await api.post("/category/add", {
        cate: categor,
      });
      props.runFunction();
      onClose();
      setLoad(false);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      setCategor("");
    } catch (error) {
      onClose();
      setLoad(false);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "warning",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="mt-5">
      {role === "admin" ? (
        <Button
          backgroundColor="black"
          color="white"
          onClick={onOpen}
          _hover={{ backgroundColor: "#3c3c3c" }}
        >
          Add Category
        </Button>
      ) : null}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New Category Name</FormLabel>
              <Input
                type="text"
                value={categor}
                onChange={(e) => setCategor(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isLoad ? (
              <Button variant="ghost" isLoading />
            ) : (
              <Button
                variant="ghost"
                backgroundColor="black"
                color="white"
                _hover={{ background: "#3c3c3c" }}
                onClick={() => handleSubmit()}
              >
                Add
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default AddCategory;
