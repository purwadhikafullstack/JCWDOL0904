import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import ModalAddWarehouse from "./manageWarehouse/ModalAddWarehouse";

const AddWarehouse = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [subdistrict, setSubsdistrict] = useState("");
  const [zip, setZip] = useState("");
  const [isLoad, setLoad] = useState(false);

  const { role } = useSelector((state) => state.userSlice);

  const getAllProvince = async () => {
    try {
      const response = await apiro.get("/rajaongkir/province");
      setProvinces(response.data.data);
    } catch (error) {
      console.log({ message: "Server Error" });
    }
  };
  const fetchAddressesCity = async () => {
    try {
      const response = await apiro.get(
        `rajaongkir/city?province_id=${provincess.id}`
      );
      setCities(response.data.data.results);
    } catch (error) {
      console.log({ message: "Server Error" });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoad(true);
      let response = await api.post("/warehouses", {
        warehouse,
        province: provincess.province,
        city: city.city,
        warehouse_city_id: city.id,
        subdistrict,
        zip: parseInt(zip),
      });
      let result;

      props.runFunction();
      inititalStock(response.data.newWarehouse.id);
      onClose();
      setLoad(false);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
      setProvincess([]);
      setCity([]);
      setSubsdistrict("");
      setZip("");
    } catch (error) {
      onClose();
      setLoad(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
    }
  };

  const inititalStock = async (id_warehouse) => {
    try {
      const response = await api.post("/warehouses/initial-stock", {
        id_warehouse,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "black",
      });
    }
  };

  useEffect(() => {
    getAllProvince();
  }, []);
  useEffect(() => {
    if (provincess.id) {
      fetchAddressesCity();
    }
  }, [provinces, provincess]);

  return (
    <div>
      {role === "admin" ? (
        <Button
          backgroundColor="black"
          color="white"
          onClick={onOpen}
          _hover={{ backgroundColor: "#3c3c3c" }}
        >
          Add Warehouse
        </Button>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalAddWarehouse
            warehouse={warehouse}
            setWarehouse={setWarehouse}
            provincess={provincess}
            setProvincess={setProvincess}
            provinces={provinces}
            city={city}
            setCity={setCity}
            cities={cities}
            subdistrict={subdistrict}
            setSubsdistrict={setSubsdistrict}
            zip={zip}
            setZip={setZip}
          />
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

export default AddWarehouse;
