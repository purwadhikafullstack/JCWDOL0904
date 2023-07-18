import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { AllCategory } from "../../features/categorySlice";
import {
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import AddCategory from "../../components/admin/AddCategory";
import Swal from "sweetalert2";
import EditeCategory from "../../components/admin/EditeCategory";
import Pagination from "../../components/admin/Pagination";

const ManageCategory = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.categorySlice.value);
  const { role } = useSelector((state) => state.userSlice);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [sort, setSort] = useState("DESC");

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category", {
        params: {
          search,
          page,
          sort,
          site: "manageC",
        },
      });
      dispatch(AllCategory(response.data.result));
      setTotalPage(response.data.totalpage);
    } catch (error) {
      console.log({ message: "Something went wrong" });
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
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "something went wrong!",
            icon: "warning",
            confirmButtonText: "Ok",
          });
          console.log({ message: "Something went wrong" });
        }
      }
    });
  };

  useEffect(() => {
    getAllCategory();
  }, [page, search, sort]);

  const categoryContainer = value?.map((el) => {
    return el.category !== "no category" ? (
      <tr key={el.id} className="flex justify-between ">
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.category}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
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
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <div className="sm:flex-auto mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Manage Category</h1>
      </div>
      <Stack direction="column-reverse">
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
        <Select
          fontSize="13px"
          maxW="100px"
          borderRadius="50px"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="DESC">A - Z</option>
          <option value="ASC">Z - A</option>
        </Select>
      </Stack>

      <AddCategory runFunction={getAllCategory} />
      <div className="mt-5 mb-6 flex flex-col justify-end  xl">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 ">
                  <tr className="flex justify-between ">
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 mr-10"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {categoryContainer}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination totalPages={totalPage} handlePageChange={handlePageClick} />
    </div>
  );
};

export default ManageCategory;
