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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SettingsIcon, DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { HomeIcon } from "@heroicons/react/24/outline";

const EditWarehouse = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoad, setLoad] = useState(false);
  const [fullname, setFullname] = useState(props.fullname);
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const url = "/user/data/update";
  const handleSubmit = async () => {
    try {
      setLoad(true);
      let response = await api.post(url, {
        id: props.uId,
        fullname,
        username,
        password,
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
      console.log(error);
    }
  };

  return (
    <div className="flex align-middle">
      <Button onClick={onOpen} variant="link" color="black">
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
              <div className="mt-1">
                <select
                  id="warehouse"
                  name="warehouse"
                  value={provincess}
                  placeholder="Select a warehouse"
                  autoComplete="warehouse"
                  className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    console.log(JSON.parse(e.target.value));
                    setProvincess(JSON.parse(e.target.value));
                  }}
                >
                  <option className="text-gray-800 font-medium">
                    {provincess ? provincess.province : "Select a warehouse"}
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

              <FormLabel>Select warehouse</FormLabel>
              <div className="mt-1">
                <select
                  id="warehouse"
                  name="warehouse"
                  value={provincess}
                  placeholder="Select a warehouse"
                  autoComplete="warehouse"
                  className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    console.log(JSON.parse(e.target.value));
                    setProvincess(JSON.parse(e.target.value));
                  }}
                >
                  <option className="text-gray-800 font-medium">
                    {provincess ? provincess.province : "Select a warehouse"}
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
