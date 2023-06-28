import { DeleteIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Divider,
  Text,
  Heading,
  Stack,
  Image,
  Flex,
  Grid,
  GridItem,
  CardFooter,
  Button,
  IconButton,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditeProduct from "./EditeProduct";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import DetailProductAdmin from "./DetailProductAdmin";
import { useSelector } from "react-redux";
// import "../pages/style/Homepage.css";

const AllProductManage = ({ products, runFunction, category }) => {
  const fileInputRef = useRef(null);
  const { role } = useSelector((state) => state.userSlice);

  const [idProduct, setIdPorduct] = useState(null);

  const imageIsCLicked = () => {
    fileInputRef.current.click();
    fileInputRef.current.value = null;
  };

  const changePic = async (file, id) => {
    try {
      console.log(id);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id);

      const response = await api.post("/product/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      runFunction();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/product/delete/${id}`);
          runFunction();
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "warning",
            confirmButtonText: "Ok",
          });
          console.log(error);
        }
      }
    });
  };

  const navigation = useNavigate();

  let count = 0;
  const allProduct = products?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        {/* <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
          {count}
        </td> */}
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          <Tooltip
            hasArrow
            label="Click to update image"
            bg="gray.300"
            color="black"
          >
            <Image
              objectFit="cover"
              //   maxW={{ base: "100%", sm: "200px" }}
              width="40px"
              height="40px"
              src={`${el.product_image}`}
              alt="Caffe Latte"
              marginLeft="10px"
              cursor="pointer"
              onClick={() => {
                imageIsCLicked();
                setIdPorduct(el.id);
              }}
            />
          </Tooltip>
          <Input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => changePic(e.target.files[0], idProduct)}
          ></Input>
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {`Rp. ${parseInt(el.price).toLocaleString("id-ID")}`}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <DetailProductAdmin productData={el} />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <Stack
            direction="row"
            spacing={0}
            display="flex"
            alignContent="center"
          >
            <EditeProduct
              runFunction={runFunction}
              productData={el}
              category={category}
              idProduct={el.id}
            />
            <Button
              disabled={role === "admin" ? false : true}
              variant="link"
              color="red"
              width="40px"
              onClick={role === "admin" ? () => deleteProduct(el.id) : null}
              backgroundColor="#F9FAFB"
              borderRadius="50px"
              _hover={{ backgroundColor: "red", color: "white" }}
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </td>
      </tr>
    );
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* {products?.map((el) => {
        return (
          <Card
            key={el.id}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            alignItems="center"
            height="90px"
            mt="5px"
          >
            <Tooltip
              hasArrow
              label="Click to update image"
              bg="gray.300"
              color="black"
            >
              <Image
                objectFit="cover"
                width="60px"
                height="60px"
                src={`${el.product_image}`}
                alt="Caffe Latte"
                marginLeft="10px"
                cursor="pointer"
                onClick={() => {
                  imageIsCLicked();
                  setIdPorduct(el.id);
                }}
              />
            </Tooltip>
            <Input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={(e) => changePic(e.target.files[0], idProduct)}
            ></Input>
            <Stack>
              <CardBody>
                <Heading size="sm" width="200px">
                  {el.product_name}
                </Heading>
                <Text>id {el.id}</Text>

                <Text
                  py="2"
                  noOfLines={2}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  fontSize="12px"
                  height="45px"
                  width="200px"
                >
                  {el.description}
                </Text>
              </CardBody>
            </Stack>
            <Button>Detail</Button>

            <CardFooter width="150px" justifyContent="right">
              <EditeProduct
                runFunction={runFunction}
                productData={el}
                category={category}
                idProduct={el.id}
              />
              <IconButton
                variant="link"
                color="red"
                backgroundColor="#F9FAFB"
                padding="10px"
                borderRadius="50px"
                _hover={{ backgroundColor: "red", color: "white" }}
                onClick={() => deleteProduct(el.id)}
                icon={<DeleteIcon />}
              />
            </CardFooter>
          </Card>
        );
      })} */}
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {/* <th
              scope="col"
              className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              No
            </th> */}

            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Image
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900  w-64"
            >
              Product Name
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Price
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              More
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
          {allProduct}
        </tbody>
      </table>
    </div>
  );
};

export default AllProductManage;
