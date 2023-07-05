import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { AllCategory } from "../../features/categorySlice";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DeleteIcon, SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import AddCategory from "../../components/admin/AddCategory";
import Swal from "sweetalert2";
import EditeCategory from "../../components/admin/EditeCategory";
import ReactPaginate from "react-paginate";

const ManageCategory = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.categorySlice.value);
  const { role } = useSelector((state) => state.userSlice);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category", {
        params: {
          search,
          page,
          site: "manageC",
        },
      });
      console.log(response);
      dispatch(AllCategory(response.data.result));
      setTotalPage(response.data.totalpage);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
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
          const response = await api.delete(`category/delete/${id}`, {
            id,
          });
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
          getAllCategory();
          console.log(response);
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "something went wrong!",
            icon: "warning",
            confirmButtonText: "Ok",
          });
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    getAllCategory();
  }, [page, search]);

  const categoryContainer = value?.map((el) => {
    return el.category !== "no category" ? (
      <tr
        key={el.id}
        className="my-5 bg-gray-50 rounded-full h-20 flex items-center"
      >
        <td className="flex row-auto items-center justify-between w-full p-10">
          <h1>{el.category}</h1>
          <ButtonGroup>
            <EditeCategory
              Cid={el.id}
              categoryName={el.category}
              runFunction={getAllCategory}
            />
            <IconButton
              variant="link"
              color="red"
              backgroundColor="#F9FAFB"
              padding="10px"
              borderRadius="50px"
              _hover={{ backgroundColor: "red", color: "white" }}
              onClick={role === "admin" ? () => deleteCategory(el.id) : null}
              icon={<DeleteIcon />}
            />
          </ButtonGroup>
        </td>
      </tr>
    ) : null;
  });

  return (
    <div className="pl-72 mr-6 mt-5">
      <div className="sm:flex-auto mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Manage Category</h1>
      </div>

      <InputGroup>
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="#B9BAC4" />}
        />
        <Input
          placeholder="Search here....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          borderRadius="50px"
        />
      </InputGroup>

      <AddCategory runFunction={getAllCategory} />
      <table className="w-full">
        <tbody>{categoryContainer}</tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPage}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="flex justify-center items-center mb-10"
        pageLinkClassName="px-2 py-1 rounded-md m-1"
        previousLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
        nextLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1"
        activeLinkClassName="px-2 py-1 bg-black text-white rounded-md m-1"
      />
    </div>
  );
};

export default ManageCategory;
