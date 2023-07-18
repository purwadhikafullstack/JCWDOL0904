import React, { useEffect, useState } from "react";
import {
  InputGroup,
  InputRightElement,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { api } from "../../API/api";
import { SearchIcon } from "@chakra-ui/icons";
import AddWarehouse from "../../components/admin/AddWarehouse";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../features/warehouseSlice";
import Pagination from "../../components/admin/Pagination";
import TableManageWarehouse from "../../components/admin/manageWarehouse/TableManageWarehouse";

const ManageWarehouse = () => {
  const value = useSelector((state) => state.warehouseSlice.value);
  const { role } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [sort, setSort] = useState("DESC");

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const getWarehouseData = async () => {
    await api
      .get("/warehouses/data", {
        params: {
          search,
          site: "manageW",
          page,
          sort,
        },
      })
      .then((result) => {
        dispatch(data(result.data.result));
        setTotalPage(result.data.totalPage);
      })
      .catch((err) => {
        console.log({ message: "Something went wrong" });
      });
  };

  const deleteWarehouse = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Did you already does a migration before deleting this warehouse!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/warehouses/delete/${id}`);
          getWarehouseData();
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
        }
      }
    });
  };

  useEffect(() => {
    getWarehouseData();
  }, [page, sort, search]);
  return (
    <div className="px-4 pt-5 sm:px-6 lg:px-8">
      {value ? (
        <div className="pr-5 min-h-max flex flex-col justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-5">
              Manage Warehouse
            </h1>
          </div>
          <Select
            width="150px"
            marginBottom="5px"
            fontSize="13px"
            height="30px"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            borderRadius="50px"
          >
            <option value="DESC">New - Old</option>
            <option value="ASC">Old - New</option>
          </Select>
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
          <div className="mt-5">
            <AddWarehouse runFunction={getWarehouseData} />
          </div>
          <TableManageWarehouse
            getWarehouseData={getWarehouseData}
            value={value}
            role={role}
            deleteWarehouse={deleteWarehouse}
          />

          <Pagination
            totalPages={totalPage}
            handlePageChange={handlePageClick}
          />
        </div>
      ) : (
        <div
          style={{
            display: "Flex",
            height: "100vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${process.env.REACT_APP_API_BASE}/logo_galaxy_2.png`}
            className="w-32 h-28 align-middle rounded-full animate-bounce"
          />
        </div>
      )}
    </div>
  );
};
export default ManageWarehouse;
