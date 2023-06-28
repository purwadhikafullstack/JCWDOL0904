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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

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
        categor,
      });
      props.runFunction();
      console.log(response);
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
      console.log(error);
    }
  };

  return (
    <div className="mt-5">
      {role === "admin" ? (
        <Button
          // leftIcon={<AddIcon />}
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
              {/* <FormLabel>Warehouse Name</FormLabel>
              <Input
                type="text"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              /> */}
              {/* <FormLabel>Province</FormLabel> */}
              {/* <div className="mt-1">
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
                    {provincess ? provincess.province : "Select a province"}
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
              </div> */}
              {/* <FormLabel>City</FormLabel> */}
              {/* <div className="mt-1">
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
              </div> */}
              <FormLabel>New Category Name</FormLabel>
              <Input
                type="text"
                value={categor}
                onChange={(e) => setCategor(e.target.value)}
              />
              {/* <FormLabel>Zip</FormLabel>
              <Input
                type="number"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              /> */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isLoad ? (
              <Button variant="ghost" isLoading />
            ) : (
              <Button
                variant="ghost"
                // leftIcon={<AddIcon />}
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
