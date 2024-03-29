import { DeleteIcon } from "@chakra-ui/icons";
import { Stack, Image, Button, Input, Tooltip } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import EditeProduct from "./EditeProduct";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import DetailProductAdmin from "./DetailProductAdmin";
import { useSelector } from "react-redux";
import TableManageProduct from "./manageProduct/TableManageProduct";

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
      Swal.fire({
        title: "Loading...",
        text: "Please wait a sec...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id);

      const response = await api.post("/product/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.close();
      runFunction();
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonColor: "black",
        confirmButtonText: "ok",
      });
    }
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Loading...",
            text: "Please wait a sec...",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const response = await api.delete(`/product/delete/${id}`);
          Swal.close();
          runFunction();
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok",
            cancelButtonColor: "black",
          });
        } catch (error) {
          Swal.close();
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "warning",
            confirmButtonText: "Ok",
            cancelButtonColor: "black",
          });
        }
      }
    });
  };

  const allProduct = products?.map((el) => {
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {role === "admin" ? (
            <>
              <Tooltip
                hasArrow
                label="Click to update image"
                bg="gray.300"
                color="black"
              >
                <Image
                  objectFit="cover"
                  width="40px"
                  height="40px"
                  src={`${process.env.REACT_APP_API_BASE}/${el.product_image}`}
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
            </>
          ) : (
            <>
              <Image
                objectFit="cover"
                width="40px"
                height="40px"
                src={`${process.env.REACT_APP_API_BASE}/${el.product_image}`}
                alt="Caffe Latte"
                marginLeft="10px"
                cursor="pointer"
              />
            </>
          )}
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
    <div>
      <div className="mt-5 mb-6 flex flex-col justify-end xl">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <TableManageProduct allProduct={allProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductManage;
