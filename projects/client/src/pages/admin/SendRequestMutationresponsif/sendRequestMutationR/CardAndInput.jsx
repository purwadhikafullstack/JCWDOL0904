import { Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const CardAndInput = (props) => {
  return (
    <>
      <Stack
        direction={props.responsif === "mobile" ? "column" : "row"}
        width={props.responsif === "mobile" ? null : "600px"}
      >
        <div className="flex justify-center">
          <Card width="200px" height="250pxpx">
            <CardBody>
              <Image
                src={`${process.env.REACT_APP_API_BASE}${props.product.product_image}`}
                alt={`${props.product.product_name}`}
                borderRadius="lg"
                width="150px"
                height="150px"
              />
              <Stack mt="6" spacing="3" alignItems="center">
                <Heading fontSize="12px" className="text-center">
                  {props.product.product_name}
                </Heading>
                <Text fontSize="sm">
                  Price: Rp.
                  {parseInt(props.product.price).toLocaleString("id-ID")}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </div>
        <div className="w-full">
          <div className="p-5">
            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-500"
              >
                Warehouse Sender
              </label>
              <div className="mt-1">
                <select
                  id="province"
                  name="province"
                  value={props.wSender}
                  autoComplete="province"
                  className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    props.setWSender(JSON.parse(e.target.value));
                  }}
                >
                  <option className="text-gray-800 font-medium">
                    {props.wSender
                      ? `selecting ${props.wSender.warehouse}`
                      : "Select a warehouse"}
                  </option>
                  {props.valueSender?.map((el) => (
                    <option
                      className="text-gray-500"
                      key={el.id}
                      value={JSON.stringify({
                        id: el.id,
                        warehouse: el.warehouse,
                      })}
                    >
                      {el.warehouse}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div>
              <label
                htmlFor="recipient-name"
                className="block text-sm font-medium text-gray-500"
              >
                Stock Request
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="recipient-name"
                  name="recipient-name"
                  autoComplete="given-name"
                  value={props.quantity}
                  className="block w-full h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                  onChange={(e) => props.setQuantity(e.target.value)}
                />
              </div>
            </div>
            <div>
              <p>stock available</p>
              {props.stock} piece
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
};

export default CardAndInput;
