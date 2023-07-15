import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const DetailProductAdmin = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Button
        variant="link"
        fontWeight="normal"
        color="blue.500"
        onClick={onOpen}
      >
        Detail
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>More Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="10px">
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="w-24">cpu speed</td>
                  <td>{props.productData.cpu_speed}</td>
                </tr>
                <tr>
                  <td className="w-24">cpu type</td>
                  <td>{props.productData.type}</td>
                </tr>
                <tr className="w-24">
                  <td>size</td>
                  <td>{props.productData.size}</td>
                </tr>
                <tr className="w-24">
                  <td>resolution</td>
                  <td>{props.productData.resolution}</td>
                </tr>
                <tr className="w-24">
                  <td>color dept</td>
                  <td>{props.productData.colorDept}</td>
                </tr>
                <tr className="w-24">
                  <td>ram</td>
                  <td>{props.productData.ram}</td>
                </tr>
                <tr className="w-24">
                  <td>storage</td>
                  <td>{props.productData.storage}</td>
                </tr>
                <tr className="w-24">
                  <td>weight</td>
                  <td>{props.productData.weight_g} g</td>
                </tr>
                <tr className="w-24">
                  <td>battery</td>
                  <td>{props.productData.battery}</td>
                </tr>
              </tbody>
            </table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DetailProductAdmin;
