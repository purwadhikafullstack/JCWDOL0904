import {
  SettingsIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { api } from "../../API/api";

const DecreaseStock = (props) => {
  const [isLoad, SetIsLoad] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stock, setStock] = useState(0);

  const handleSubmit = async () => {
    onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Loading...",
            text: "Please wait a sec...",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const token = JSON.parse(localStorage.getItem("auth"));
          const response = await api.patch(
            "/stock/decrease",
            {
              id: props.idStock,
              newStock: stock,
            },
            {
              headers: {
                Authorization: token,
                Accept: "appplication/json",
                "Content-Type": "application/json",
              },
            }
          );
          Swal.close();
          Swal.fire({
            title: "Success",
            text: "Subtrack success!",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "black",
          });
          props.runFunction();
          setStock(0);
        } catch (error) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response.data.message,
            confirmButtonText: "Ok",
            confirmButtonColor: "black",
          });
        }
      }
    });
  };

  return (
    <div className="flex align-middle">
      <IconButton
        onClick={onOpen}
        variant="link"
        color="black"
        icon={<TriangleDownIcon color="red" />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Decrease Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Current Stock</FormLabel>
              <Text>{props.stockNow}</Text>
              <FormLabel>Stock Subtract</FormLabel>
              <NumberInput
                defaultValue={stock}
                onChange={(e) => setStock(parseInt(e))}
                min={0}
                max={parseInt(props.stockNow)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
                Change
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DecreaseStock;
