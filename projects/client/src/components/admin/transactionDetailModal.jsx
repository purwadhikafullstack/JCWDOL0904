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
import { DeleteIcon, AddIcon, EditIcon, Search2Icon } from "@chakra-ui/icons";
import { apiro } from "../../API/apiro";
import { api } from "../../API/api";
import Swal from "sweetalert2";

const TransDetail = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoad, setLoad] = useState(false);
  const [product, setProduct] = useState(
    props.fullData.TransactionItems[0].Product.product_name
  );
  const [quantity, setQuantity] = useState(
    props.fullData.TransactionItems[0].quantity
  );
  const [username, setUsername] = useState(props.fullData.User.username);

  return (
    <div className="flex align-middle">
      <Button onClick={onOpen} variant="link" color="black">
        <Search2Icon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Product</FormLabel>
              <Input
                type="text"
                value={product}
                readOnly
                // onChange={(e) => setUsername(e.target.value)}
              />
              <FormLabel>Quantity</FormLabel>
              <Input
                type="text"
                value={quantity}
                readOnly
                // onChange={(e) => setFullname(e.target.value)}
              />
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                readOnly
                // onChange={(e) => setFullname(e.target.value)}
              />
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
                onClick={() => onClose()}
              >
                Ok
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TransDetail;
