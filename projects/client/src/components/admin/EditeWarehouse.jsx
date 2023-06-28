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
} from "@chakra-ui/react";
import { SettingsIcon, DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

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
  const [idProvince, setIdProvince] = useState(0);

  const { role } = useSelector((state) => state.userSlice);

  const getAllProvince = async () => {
    try {
      const response = await apiro.get("/rajaongkir/province");
      console.log(response.data.data);
      // const result = response.data.data.find(
      //   (el) => el.province === "DI Yogyakarta"
      // );
      // console.log(result);
      // jawa barat =9
      // jawa timur = 11
      // ID Yogyakarta =
      setProvinces(response.data.data);
      runGetCity(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAddressesCity = async (id) => {
    let provId;
    if (!id || id.lenght < 1) {
      provId = provincess.id;
    } else {
      provId = id;
    }
    try {
      // console.log(provincess.id);
      const response = await apiro.get(`rajaongkir/city?province_id=${provId}`);
      console.log(response.data.data.results);
      setCities(response.data.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    // console.log(props.wId);
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
      console.log(response);
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
      console.log(error);
    }
  };

  const runGetCity = (value) => {
    const result = value?.find((el) => el.province === props.province);
    console.log(result);
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
    // console.log(result);
    if (provincess.id) {
      fetchAddressesCity();
    }
  }, [provinces, provincess]);

  useEffect(() => {
    console.log(city, provincess);
  }, [provincess, city]);

  useEffect(() => {
    // const result = provinces?.find((el) => props.province === el.province);
    // // console.log(result.province_id);
    // {result ? ) :null}
    setProvincess({ province: props.province });
    setCity({ city: props.city, id: props.warehouse_city_id });
    setWarehouse(props.warehouse);
    setSubsdistrict(props.subdistrict);
    setZip(props.zip);
  }, [props]);

  return (
    <div className="flex align-middle">
      {/* <Button leftIcon={<AddIcon />} onClick={onOpen}>
        Add Warehouse
      </Button> */}
      {/* <Button
        onClick={onOpen}
        
        disabled={role === "admin" ? false : true}
      >
        <SettingsIcon />
      </Button> */}

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
          <ModalBody>
            <FormControl>
              <FormLabel>Warehouse Name</FormLabel>
              <Input
                type="text"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              />
              <FormLabel>Province</FormLabel>
              <div className="mt-1">
                <select
                  id="province"
                  name="province"
                  value={provincess}
                  placeholder="Select a province"
                  autoComplete="province"
                  className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    console.log(JSON.parse(e.target.value));
                    setProvincess(JSON.parse(e.target.value));
                  }}
                >
                  <option className="text-gray-800 font-medium">
                    {provincess ? provincess.province : "Select province"}
                  </option>
                  {provinces?.map((province) => {
                    return (
                      <option
                        className="text-gray-500"
                        key={province.province_id}
                        value={JSON.stringify({
                          id: province.province_id,
                          province: province.province,
                        })}
                      >
                        {province.province}
                      </option>
                    );
                  })}
                </select>
              </div>
              <FormLabel>City</FormLabel>
              <div className="mt-1">
                <select
                  id="province"
                  name="province"
                  value={city}
                  autoComplete="province"
                  className="block w-full pl-2 h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    setCity(JSON.parse(e.target.value));
                  }}
                >
                  <option>{city ? city.city : "Select a City"}</option>
                  {cities.map((city) => (
                    <option
                      className="text-gray-500"
                      key={city.city_id}
                      value={JSON.stringify({
                        city: city.city_name,
                        id: city.city_id,
                        type: city.type,
                      })}
                    >
                      {`${city.type} ${city.city_name}`}
                    </option>
                  ))}
                </select>
              </div>
              <FormLabel>Subdistrict</FormLabel>
              <Input
                type="text"
                value={subdistrict}
                onChange={(e) => setSubsdistrict(e.target.value)}
              />
              <FormLabel>Zip</FormLabel>
              <Input
                type="number"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditeWarehouse;
