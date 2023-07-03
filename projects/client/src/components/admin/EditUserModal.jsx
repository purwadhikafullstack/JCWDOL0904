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

const EditUser = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoad, setLoad] = useState(false);
  const [fullname, setFullname] = useState(props.fullname);
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const url = "/user/data/update";
  const handleSubmit = async () => {
    const id = JSON.parse(localStorage.getItem("auth"));
    const role = id ? id.role : null;
    console.log(role);
    try {
      setLoad(true);
      let response = await api.post(url, {
        id: props.uId,
        fullname,
        username,
        password,
        role: role,
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
        <SettingsIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormLabel>Fullname</FormLabel>
              <Input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
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

export default EditUser;
