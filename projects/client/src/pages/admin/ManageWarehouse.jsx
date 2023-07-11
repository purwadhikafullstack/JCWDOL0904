import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Spinner,
  InputGroup,
  InputRightElement,
  Input,
  useMediaQuery,
  Select,
} from "@chakra-ui/react";
import { api } from "../../API/api";
import {
  SettingsIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import AddWarehouse from "../../components/admin/AddWarehouse";
import EditeWarehouse from "../../components/admin/EditeWarehouse";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../features/warehouseSlice";
import ReactPaginate from "react-paginate";
import Pagination from "../../components/admin/Pagination";

const ManageWarehouse = () => {
  const value = useSelector((state) => state.warehouseSlice.value);
  const { role } = useSelector((state) => state.userSlice);
  const [isSmallerThan] = useMediaQuery("(max-width: 767px)");

  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [sort, setSort] = useState("DESC");
  const [paddingLeft, setPaddingLeft] = useState("pl-72");

  useEffect(() => {
    console.log(value);
  }, []);

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
        console.log(result);
        setWarehouses(result.data.result);
        dispatch(data(result.data.result));
        setTotalPage(result.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
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
          console.log(response);
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
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    getWarehouseData();
    // alert("klik");
  }, [page, sort, search]);

  let count = 0;
  const warehouse = value?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          {el.warehouse}
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
              runFunction={getWarehouseData}
            />
            <Button
              variant="link"
              color="red"
              width="40px"
              onClick={role === "admin" ? () => deleteWarehouse(el.id) : null}
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </td>
      </tr>
    );
  });

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      {value ? (
        <div className="pr-5">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-5">
              Manage Warehouse
            </h1>
          </div>
          <Select
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
