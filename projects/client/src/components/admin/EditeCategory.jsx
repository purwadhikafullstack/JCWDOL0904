import React, { useState } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditeCategory = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categor, setCategor] = useState(props.categoryName);
  const [isLoad, setLoad] = useState(false);

  const { role } = useSelector((state) => state.userSlice);

  const handleSubmit = async () => {
    try {
      setLoad(true);
      let response = await api.patch("/category/update", {
        id: props.Cid,
        cate: categor,
      });
      onClose();
      setLoad(false);
      console.log(response);
      props.runFunction();
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
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
    <div className="flex align-middle">
      <IconButton
        onClick={role === "admin" ? onOpen : null}
        variant="link"
        color="black"
        backgroundColor="#F9FAFB"
        padding="10px"
        borderRadius="50px"
        _hover={{ backgroundColor: "black", color: "white" }}
        icon={<SettingsIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Category Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                type="text"
                value={categor}
                onChange={(e) => setCategor(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isLoad ? (
              <Button variant="ghost" isLoading></Button>
            ) : (
              <Button
                variant="ghost"
                backgroundColor="black"
                color="white"
                _hover={{ backgroundColor: "#3c3c3c" }}
                onClick={() => handleSubmit()}
              >
                Edit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditeCategory;
