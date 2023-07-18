import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mutation } from "../../features/mutationListSlice";
import Pagination from "../../components/admin/Pagination";
import AllMutation from "../../components/admin/mutationList/AllMutation";
import MutationListTable from "../../components/admin/mutationList/MutationListTable";
import MutationFilterModal from "../../components/admin/mutationList/MutationFilterModal";
import SearchAndAddMi from "../../components/admin/mutationList/SearchAndAddMi";

const MutationList = () => {
  const navigation = useNavigate();
  const value = useSelector((state) => state.mutationListSlice.value);
  const { role } = useSelector((state) => state.userSlice);
  const warehouse = useSelector((state) => state.warehouseSlice.value);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("all");
  const [arrange, setArrange] = useState("DESC");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [sort, setSort] = useState(1);
  const [isAdmin, setIsAdmin] = useState();
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
          Swal.fire("Confirmed!", "Mutation has been confirmed.", "success");
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

  const allMutation = value?.map((el) => {
    return (
      <AllMutation
        el={el}
        rejectMutation={rejectMutation}
        proceedMutation={proceedMutation}
        request={request}
      />
    );
  });

  useEffect(() => {
    console.log(status);
  }, [status]);

  const handleSorting = (value) => {
    setSort(parseInt(value));
  };

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-5"> Mutation </h1>

      <MutationFilterModal
        isAdmin={isAdmin}
        sort={sort}
        handleSorting={handleSorting}
        warehouse={warehouse}
        status={status}
        setStatus={setStatus}
        request={request}
        setRequest={setRequest}
        arrange={arrange}
        setArrange={setArrange}
      />

      <SearchAndAddMi
        navigation={navigation}
        search={search}
        role={role}
        setSearch={setSearch}
        getMutationData={getMutationData}
        warehouse={warehouse}
      />

      <MutationListTable allMutation={allMutation} />
      <Pagination totalPages={totalPage} handlePageChange={handlePageClick} />
    </div>
  );
};

export default MutationList;
