import React, { useState } from "react";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { Button } from "@chakra-ui/react";

const CancelOrderButton = (props) => {
  const [isLoad, setIsLoading] = useState(false);
  const handleCancel = async (value) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const response = await api.post("/order/order-cancel", {
            dataTransaction: value,
          });
          Swal.fire({
            title: "Success",
            text: "Cancel success!",
            icon: "success",
            confirmButtonText: "Ok",
          });
          props.runFunction();
          setIsLoading(false);
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "something went wrong!",
            icon: "warning",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  return (
    <>
      <Button
        isLoading={isLoad}
        color="white"
        backgroundColor="red.600"
        fontSize="xx-small"
        height="25px"
        onClick={() => handleCancel(props.dataTransaction)}
        className="text-white -mr-2 rounded-md w-14 h-6 text-[10px] bg-red-700 hover:bg-red-800"
      >
        Cancel
      </Button>
    </>
  );
};

export default CancelOrderButton;
