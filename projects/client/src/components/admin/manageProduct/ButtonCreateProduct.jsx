import { Button, ModalFooter } from "@chakra-ui/react";
import React from "react";

const ButtonCreateProduct = (props) => {
  return (
    <>
      <ModalFooter>
        <Button
          backgroundColor="black"
          color="white"
          _hover={{ backgroundColor: "#3c3c3c" }}
          mr={3}
          onClick={() => {
            props.onClose();
            props.handleSubmit();
          }}
        >
          Create
        </Button>
      </ModalFooter>
    </>
  );
};

export default ButtonCreateProduct;
