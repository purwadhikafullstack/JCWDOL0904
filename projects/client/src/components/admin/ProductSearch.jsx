import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";

const ProductSearch = ({ productName, handleSearch }) => {
  return (
    <div className="w-full">
      <InputGroup>
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="#B9BAC4" />}
        />
        <Input
          placeholder="Search Product"
          borderRadius="50px"
          value={productName}
          onChange={(e) => handleSearch(e.target.value)}
          paddingX={3}
        />
      </InputGroup>
    </div>
  );
};

export default ProductSearch;
