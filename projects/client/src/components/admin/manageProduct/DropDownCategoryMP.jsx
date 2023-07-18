import { FormLabel, Select } from "@chakra-ui/react";
import React from "react";

const DropDownCategoryMP = (props) => {
  return (
    <>
      <FormLabel>Category</FormLabel>
      <Select
        defaultValue={props.category}
        onChange={(e) => {
          props.setCategory(e.target.value);
        }}
      >
        {props.Allcategory?.map((el) => {
          return (
            <option key={el.id} value={el.id}>
              {el.category}
            </option>
          );
        })}
      </Select>
    </>
  );
};

export default DropDownCategoryMP;
