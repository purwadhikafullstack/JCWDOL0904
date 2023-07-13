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

const EditeCategory = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState([]);
  const [categor, setCategor] = useState(props.categoryName);
  const [subdistrict, setSubsdistrict] = useState("");
  const [zip, setZip] = useState("");
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

  useEffect(() => {
    console.log(props);
  });

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

export default EditeCategory;
