import { Select, Stack } from "@chakra-ui/react";
import React from "react";

const MutationFilterModal = (props) => {
  return (
    <>
      <div>
        <Stack
          display="flex"
          flexDirection="row"
          marginBottom="5px"
          alignItems="center"
        >
          <Select
            borderRadius="50px"
            {...(props.isAdmin ? {} : { disabled: true })}
            defaultValue={props.sort}
            onChange={(e) => props.handleSorting(e.target.value)}
          >
            {props.warehouse?.map((el) => {
              return (
                <option key={el.id} value={el.id}>
                  {el.warehouse}
                </option>
              );
            })}
          </Select>
          <Select
            borderRadius="50px"
            defaultValue={props.status}
            onChange={(e) => props.setStatus(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="migration">Migration</option>
          </Select>
        </Stack>
        <Stack direction="row" marginBottom="10px">
          <Select
            borderRadius="50px"
            defaultValue={props.request}
            onChange={(e) => props.setRequest(e.target.value)}
          >
            <option value="in">Product In</option>
            <option value="out">Product Out</option>
          </Select>
          <Select
            borderRadius="50px"
            defaultValue={props.arrange}
            onChange={(e) => props.setArrange(e.target.value)}
          >
            <option value="DESC">Newest to oldest</option>
            <option value="ASC">Oldest to newest</option>
          </Select>
        </Stack>
      </div>
    </>
  );
};

export default MutationFilterModal;
