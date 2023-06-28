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
  const subtittle = [
    "cpu speed",
    "cpu type",
    "size",
    "resolution",
    "color dept",
    "ram",
    "storage",
    "weight",
    "battery",
  ];
  let num = 0;

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <button
        className=" rounded-md border border-transparent bg-gray-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={onOpen}
      >
        Detail
      </button>

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

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DetailProductAdmin;
