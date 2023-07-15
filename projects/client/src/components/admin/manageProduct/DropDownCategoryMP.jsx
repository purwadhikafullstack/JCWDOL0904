import { FormLabel, Select } from "@chakra-ui/react";
import React from "react";

const DropDownCategoryMP = (props) => {
  return (
    <>
      <FormLabel>Category</FormLabel>
      <Select
        placeholder={props.category}
        defaultValue={props.category}
        onChange={(e) => {
          props.setCategory(e.target.value);
          console.log(e.target.value);
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

      <FormLabel>Cpu Speed</FormLabel>
    </>
  );
};

export default DropDownCategoryMP;
