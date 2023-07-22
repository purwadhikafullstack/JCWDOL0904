import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";

const EmailSearch = ({ email, handleSearch }) => {
  return (
    <div className="w-full">
      <InputGroup>
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="#B9BAC4" />}
        />
        <Input
          placeholder="Search Email"
          borderRadius="50px"
          value={email}
          onChange={handleSearch}
          paddingX={3}
        />
      </InputGroup>
    </div>
  );
};

export default EmailSearch;
