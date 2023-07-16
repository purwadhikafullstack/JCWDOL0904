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
  IconButton,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import ModalEditeWarehouse from "./manageWarehouse/ModalEditeWarehouse";

const EditeWarehouse = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState({});
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState({});
  const [warehouse, setWarehouse] = useState("");
  const [subdistrict, setSubsdistrict] = useState("");
  const [zip, setZip] = useState("");
  const [isLoad, setLoad] = useState(false);
  const { role } = useSelector((state) => state.userSlice);
  const getAllProvince = async () => {
    try {
      const response = await apiro.get("/rajaongkir/province");
      console.log(response.data.data);

      setProvinces(response.data.data);
      runGetCity(response.data.data);
    } catch (error) {}
  };
  const fetchAddressesCity = async (id) => {
    let provId;
    if (!id || id.lenght < 1) {
      provId = provincess.id;
    } else {
      provId = id;
    }
    try {
      const response = await apiro.get(`rajaongkir/city?province_id=${provId}`);
      setCities(response.data.data.results);
    } catch (error) {}
  };

  const handleSubmit = async () => {
    console.log({
      warehouse,
      province: provincess.province,
      city: city.city,
      warehouse_city_id: city.id,
      subdistrict,
      zip: parseInt(zip),
      id: props.wId,
    });
    try {
      setLoad(true);
      let response = await api.post("/warehouses/update", {
        warehouse,
        province: provincess.province,
        city: city.city,
        warehouse_city_id: city.id,
        subdistrict,
        zip: parseInt(zip),
        id: props.wId,
      });
      onClose();
      setLoad(false);
      props.runFunction();
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      setProvincess([]);
      setCity([]);
      setSubsdistrict("");
      setZip("");
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

  const runGetCity = (value) => {
    const result = value?.find((el) => el.province === props.province);
    if (provincess.id) {
      fetchAddressesCity();
    } else {
      fetchAddressesCity(result.province_id);
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

  useEffect(() => {
    setProvincess({ province: props.province });
    setCity({ city: props.city, id: props.warehouse_city_id });
    setWarehouse(props.warehouse);
    setSubsdistrict(props.subdistrict);
    setZip(props.zip);
  }, [props]);

  return (
    <div className="flex align-middle">
      <IconButton
        onClick={role === "admin" ? onOpen : null}
        variant="link"
        color="black"
        icon={<SettingsIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalEditeWarehouse
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

export default EditeWarehouse;
