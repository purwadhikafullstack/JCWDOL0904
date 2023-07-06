import {SearchIcon} from "@chakra-ui/icons";
import {Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import React from "react";

const OrderSearch = ({invoiceNumber, handleSearch}) => {
  return (
    <div className="w-full">
      <InputGroup>
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="#B9BAC4" />}
        />
        <Input
          placeholder="Search Invoice Number"
          borderRadius="50px"
          value={invoiceNumber}
          onChange={handleSearch}
          paddingX={3}
        />
      </InputGroup>
    </div>
  );
};

export default OrderSearch;
