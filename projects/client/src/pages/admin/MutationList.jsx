import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
  TabList,
  useDisclosure,
  Stack,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Select,
  useMediaQuery,
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
import { useNavigate } from "react-router-dom";
import { mutation } from "../../features/mutationListSlice";
import ReactPaginate from "react-paginate";
import MigrationModal from "../../components/admin/migrationModal";
import Pagination from "../../components/admin/Pagination";

const MutationList = () => {
  const navigation = useNavigate();
  const value = useSelector((state) => state.mutationListSlice.value);
  const { role } = useSelector((state) => state.userSlice);
  const warehouse = useSelector((state) => state.warehouseSlice.value);
  const [isSmallerThan] = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();

  const [status, setStatus] = useState("all");
  const [arrange, setArrange] = useState("DESC");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [warehouses, setWarehouses] = useState([]);
  const [paddingLeft, setPaddingLeft] = useState("pl-72");
  const [sort, setSort] = useState(1);
  const [isAdmin, setIsAdmin] = useState();
  const [isError, setIsError] = useState(null);
  const [request, setRequest] = useState("in");
  const swalCheckingObject = {
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  };
  const swalErrorCatch = (error) => {
    Swal.fire({ title: "Error!", text: error, icon: "error" });
  };

  const rejectMutation = async (id) => {
    Swal.fire(swalCheckingObject).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await api.patch("/mutation/rejected", {
            id,
          });
          console.log(response);
          getMutationData();
          Swal.fire("Rejected!", "Mutation has been rejected.", "success");
        }
      } catch (error) {
        console.log(error);
        swalErrorCatch(error.response.data.message);
        getMutationData();
      }
    });
  };

  const proceedMutation = async (
    id,
    warehouse_sender_id,
    warehouse_receive_id,
    qty,
    id_product
  ) => {
    Swal.fire(swalCheckingObject).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await api.patch("/mutation/proceed", {
            id,
            warehouse_sender_id,
            warehouse_receive_id,
            qty,
            id_product,
          });
          console.log(response);
          getMutationData();
          Swal.fire("Confirmed!", "Mutatition has been confirmed.", "success");
        }
      } catch (error) {
        console.log(error);
        swalErrorCatch(error.response.data.message);
        getMutationData();
      }
    });
  };

  useEffect(() => {
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    console.log(role);
  }, [role]);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const getMutationData = async () => {
    const token = JSON.parse(localStorage.getItem("auth"));
    await api
      .get("/mutation/data-mutation", {
        params: {
          sort,
          role,
          page,
          site: "mutationList",
          search,
          status,
          arrange,
          request,
        },
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        console.log(result);
        dispatch(mutation(result.data.result));
        setTotalPage(result.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMutationData();
  }, [sort, page, search, status, arrange, request]);

  let count = 0;
  const allMutation = value?.map((el) => {
    count++;
    return (
      <tr key={el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.quantity}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.Product.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.senderWarehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {el.receiverWarehouse.warehouse}
        </td>
        {request === "in" ? (
          el.status === "pending" ? (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <button
                type="submit"
                className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                // onClick={() => navigation("/manage-mutation")}
                onClick={() => rejectMutation(el.id)}
              >
                Reject
              </button>
            </td>
          ) : el.status === "migration" ? (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <button
                type="submit"
                className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                onClick={() =>
                  proceedMutation(
                    el.id,
                    el.senderWarehouse.id,
                    el.receiverWarehouse.id,
                    el.quantity,
                    el.Product.id
                  )
                }
              >
                Confirm
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                // onClick={() => navigation("/manage-mutation")}
                onClick={() => rejectMutation(el.id)}
              >
                Reject
              </button>
            </td>
          ) : (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              No Action
            </td>
          )
        ) : el.status === "approved" || el.status === "rejected" ? (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            No Action
          </td>
        ) : el.status === "migration" ? (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              // onClick={() => navigation("/manage-mutation")}
              onClick={() => rejectMutation(el.id)}
            >
              Reject
            </button>
          </td>
        ) : (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              onClick={() =>
                proceedMutation(
                  el.id,
                  el.senderWarehouse.id,
                  el.receiverWarehouse.id,
                  el.quantity,
                  el.Product.id
                )
              }
            >
              Confirm
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              // onClick={() => navigation("/manage-mutation")}
              onClick={() => rejectMutation(el.id)}
            >
              Reject
            </button>
          </td>
        )}
      </tr>
    );
  });

  useEffect(() => {
    console.log(status);
  }, [status]);

  const handleSorting = (value) => {
    // console.log(typeof value);
    setSort(parseInt(value));
  };

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-5"> Mutation </h1>

      <div>
        <Stack
          display="flex"
          flexDirection="row"
          marginBottom="5px"
          alignItems="center"
        >
          {/* <Text>Warehouse:</Text> */}
          <Select
            borderRadius="50px"
            {...(isAdmin ? {} : { disabled: true })}
            defaultValue={sort}
            onChange={(e) => handleSorting(e.target.value)}
          >
            {warehouse?.map((el) => {
              return (
                <option key={el.id} value={el.id}>
                  {el.warehouse}
                </option>
              );
            })}
          </Select>
          {/* <Text>Status:</Text> */}
          <Select
            borderRadius="50px"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="migration">Migration</option>
          </Select>
        </Stack>
        <Stack direction="row" marginBottom="10px">
          <Select
            borderRadius="50px"
            defaultValue={request}
            onChange={(e) => setRequest(e.target.value)}
          >
            <option value="in">Product In</option>
            <option value="out">Product Out</option>
          </Select>
          {/* <Text>Sort:</Text> */}
          <Select
            borderRadius="50px"
            defaultValue={arrange}
            onChange={(e) => setArrange(e.target.value)}
          >
            <option value="DESC">Newest to oldest</option>
            <option value="ASC">Oldest to newest</option>
          </Select>
        </Stack>
      </div>
      <Stack direction="row">
        {role === "adminWarehouse" ? (
          <button
            type="submit"
            className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => navigation("/manage-mutation")}
          >
            Mutation
          </button>
        ) : null}
        {role === "admin" ? (
          <MigrationModal
            runFunction={getMutationData}
            allWarehouse={warehouse}
          />
        ) : null}

        <InputGroup>
          <InputRightElement
            pointerEvents="none"
            children={<SearchIcon color="#B9BAC4" />}
          />
          <Input
            placeholder="Search product here....."
            value={search}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            borderRadius="50px"
          />
        </InputGroup>
      </Stack>

      <div className="mt-5 mb-6 flex flex-col justify-end  xl">
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
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warehouse Sender
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warehouse Receiver
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
                  {allMutation}
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

export default MutationList;
