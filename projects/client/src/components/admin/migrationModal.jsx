import {
  Button,
  FormLabel,
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
import Swal from "sweetalert2";
import { api } from "../../API/api";

const MigrationModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouseId, setwarehouseId] = useState("");
  const [warehouseIdReceive, setwarehouseIdReceive] = useState("");

  const handleSubmit = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Mutation All Stock!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/migration/add", {
            warehouse_sender_id: parseInt(warehouseId),
            warehouse_receive_id: parseInt(warehouseIdReceive),
          });
          console.log(response);
          props.runFunction();
          Swal.fire(`${warehouseId}`);
        } catch (error) {
          console.log({ message: "Something went wrong" });
        }
      }
    });
  };

  return (
    <div>
      <Button
        backgroundColor="black"
        color="white"
        onClick={() => {
          onOpen();
          setwarehouseId("");
          setwarehouseIdReceive("");
        }}
        _hover={{ backgroundColor: "#3c3c3c" }}
      >
        Add Migration
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose warehouse for migration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Warehouse sender</FormLabel>
            <Select
              placeholder={warehouseId ? null : "select warehouse"}
              //   defaultValue={categor.category ? categor.category : null}
              onChange={(e) => {
                setwarehouseId(e.target.value);
                console.log(e.target.value);
              }}
            >
              {props.allWarehouse?.map((el) => {
                return (
                  <option
                    hidden={el.id === parseInt(warehouseIdReceive)}
                    key={el.id}
                    value={el.id}
                  >
                    {el.warehouse}
                  </option>
                );
              })}
            </Select>
            <FormLabel>Warehouse Receiver</FormLabel>
            <Select
              disabled={warehouseId ? false : true}
              placeholder={warehouseIdReceive ? null : "select warehouse"}
              onChange={(e) => {
                setwarehouseIdReceive(e.target.value);
                console.log(e.target.value);
              }}
            >
              {props.allWarehouse?.map((el) => {
                return (
                  <option
                    hidden={el.id === parseInt(warehouseId)}
                    key={el.id}
                    value={el.id}
                  >
                    {el.warehouse}
                  </option>
                );
              })}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={warehouseId && warehouseIdReceive ? false : true}
              variant="ghost"
              backgroundColor="black"
              color="white"
              _hover={{ backgroundColor: "#3c3c3c" }}
              onClick={() => {
                onClose();
                handleSubmit();
              }}
            >
              Migration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MigrationModal;
