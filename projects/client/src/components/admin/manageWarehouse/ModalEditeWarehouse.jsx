import { FormControl, FormLabel, Input, ModalBody } from "@chakra-ui/react";
import React from "react";

const ModalEditeWarehouse = (props) => {
  return (
    <>
      <ModalBody>
        <FormControl>
          <FormLabel>Warehouse Name</FormLabel>
          <Input
            type="text"
            value={props.warehouse}
            onChange={(e) => props.setWarehouse(e.target.value)}
          />
          <FormLabel>Province</FormLabel>
          <div className="mt-1">
            <select
              disabled
              id="province"
              name="province"
              value={props.provincess}
              placeholder="Select a province"
              autoComplete="province"
              className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => {
                props.setProvincess(JSON.parse(e.target.value));
              }}
            >
              <option className="text-gray-800 font-medium">
                {props.provincess
                  ? props.provincess.province
                  : "Select province"}
              </option>
              {props.provinces?.map((province) => {
                return (
                  <option
                    className="text-gray-500"
                    key={province.province_id}
                    value={JSON.stringify({
                      id: province.province_id,
                      province: province.province,
                    })}
                  >
                    {province.province}
                  </option>
                );
              })}
            </select>
          </div>
          <FormLabel>City</FormLabel>
          <div className="mt-1">
            <select
              disabled
              id="province"
              name="province"
              value={props.city}
              autoComplete="province"
              className="block w-full pl-2 h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => {
                props.setCity(JSON.parse(e.target.value));
              }}
            >
              <option>{props.city ? props.city.city : "Select a City"}</option>
              {props.cities.map((city) => (
                <option
                  className="text-gray-500"
                  key={city.city_id}
                  value={JSON.stringify({
                    city: city.city_name,
                    id: city.city_id,
                    type: city.type,
                  })}
                >
                  {`${city.type} ${city.city_name}`}
                </option>
              ))}
            </select>
          </div>
          <FormLabel>Subdistrict</FormLabel>
          <Input
            type="text"
            value={props.subdistrict}
            onChange={(e) => props.setSubsdistrict(e.target.value)}
          />
          <FormLabel>Zip</FormLabel>
          <Input
            type="number"
            value={props.zip}
            onChange={(e) => props.setZip(e.target.value)}
          />
        </FormControl>
      </ModalBody>
    </>
  );
};

export default ModalEditeWarehouse;
