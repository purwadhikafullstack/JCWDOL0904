import { Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import React from "react";
import MigrationModal from "../migrationModal";
import { SearchIcon } from "@chakra-ui/icons";

const SearchAndAddMi = (props) => {
  return (
    <>
      <Stack direction="row">
        {props.role === "adminWarehouse" ? (
          <button
            type="submit"
            className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => props.navigation("/manage-mutation")}
          >
            Mutation
          </button>
        ) : null}
        {props.role === "admin" ? (
          <MigrationModal
            runFunction={props.getMutationData}
            allWarehouse={props.warehouse}
          />
        ) : null}

        <InputGroup>
          <InputRightElement
            pointerEvents="none"
            children={<SearchIcon color="#B9BAC4" />}
          />
          <Input
            placeholder="Search product here....."
            value={props.search}
            type="text"
            onChange={(e) => props.setSearch(e.target.value)}
            borderRadius="50px"
          />
        </InputGroup>
      </Stack>
    </>
  );
};

export default SearchAndAddMi;
