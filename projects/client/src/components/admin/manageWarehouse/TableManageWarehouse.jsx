import { Button, Stack } from "@chakra-ui/react";
import React from "react";
import EditeWarehouse from "../EditeWarehouse";
import { DeleteIcon } from "@chakra-ui/icons";

const TableManageWarehouse = (props) => {
  const warehouse = props.value?.map((el) => {
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.province}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.city}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <Stack
            direction="row"
            spacing={0}
            display="flex"
            alignContent="center"
          >
            <EditeWarehouse
              wId={el.id}
              warehouse={el.warehouse}
              province={el.province}
              city={el.city}
              warehouse_city_id={el.warehouse_city_id}
              subdistrict={el.subdistrict}
              zip={el.zip}
              runFunction={props.getWarehouseData}
            />
            <Button
              variant="link"
              color="red"
              width="40px"
              onClick={
                props.role === "admin"
                  ? () => props.deleteWarehouse(el.id)
                  : null
              }
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </td>
      </tr>
    );
  });
  return (
    <>
      <div className="mt-6 flex flex-col justify-end xl mb-5">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warehouse Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Province
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {warehouse}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableManageWarehouse;
