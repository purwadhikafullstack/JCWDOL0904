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
import { HomeIcon } from "@heroicons/react/24/outline";

const EditWarehouse = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoad, setLoad] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(
    props.warehouse || {}
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState({});
  const [warehouses, setWarehouses] = useState([]);

  const url = "/warehouses/data";
  console.log(props.uId);

  const getWarehouseData = async () => {
    try {
      let response = await api.get(url);
      setWarehouses(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const urlUpdate = "/warehouses/update/admin";
  const token = JSON.parse(localStorage.getItem("auth"));
  const handleSubmit = async () => {
    try {
      let response = await api.post(
        urlUpdate,
        {
          currentWarehouse: currentWarehouse.id,
          id_warehouse: selectedWarehouse.id,
          id: props.uId,
        },
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      setCurrentWarehouse(selectedWarehouse);
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "warning",
        confirmButtonText: "Ok",
      });
      onClose();
      console.log(error);
    }
  };

  useEffect(() => {
    getWarehouseData();
  }, []);

  return (
    <div className="flex align-middle">
      <Button
        onClick={
          props.role === "user" || props.role === "admin"
            ? null
            : () => onOpen()
        }
        variant="link"
        color="black"
      >
        <HomeIcon width="20px" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Warehouse Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Current warehouse</FormLabel>
              <Input
                type="text"
                readOnly
                value={currentWarehouse.warehouse}
                onChange={(e) => setCurrentWarehouse(e.target.value)}
              />

              <FormLabel>Select warehouse</FormLabel>
              <div className="mt-1">
                <select
                  id="warehouse"
                  name="warehouse"
                  value={JSON.stringify(selectedWarehouse)}
                  placeholder="Select a warehouse"
                  autoComplete="warehouse"
                  className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    const selected = JSON.parse(e.target.value);
                    setSelectedWarehouse(selected);
                  }}
                >
                  <option className="text-gray-800 font-medium">
                    {"Select a warehouse"}
                  </option>
                  {warehouses?.map((warehouse) => {
                    return (
                      <option
                        className="text-gray-500"
                        key={warehouse.id}
                        value={JSON.stringify({
                          id: warehouse.id,
                          warehouse: warehouse.warehouse,
                        })}
                      >
                        {warehouse.warehouse}
                      </option>
                    );
                  })}
                </select>
              </div>
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
                Accept
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditWarehouse;
