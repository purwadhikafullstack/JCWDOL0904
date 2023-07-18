import React, { useEffect, useState } from "react";
import { api } from "../../API/api";
import { Button, ButtonGroup, IconButton, Stack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Swal from "sweetalert2";
import Alert from "../../components/SwallAlert";
import Pagination from "../../components/admin/Pagination";
import AddEkspedisiModal from "../../components/admin/AddEkspedisiModal";

export const EkspedisiAdmin = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [ekspedisi, setEkspedisi] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchEkspedisi = async () => {
    try {
      const response = await api.get("/ekspedisi", {
        params: {
          page: currentPage,
        },
      });
      setEkspedisi(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      Alert({
        title: "Failed!",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };
  useEffect(() => {
    fetchEkspedisi();
  }, [currentPage]);
  const confirmDeleteEkspedisi = (id) => {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to delete this Ekspedisi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "black",
      cancelButtonText: "Cancel",
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEkspedisi(id);
      }
    });
  };

  const deleteEkspedisi = async (id) => {
    try {
      let response = await api.delete(`/ekspedisi/${id}`);
      fetchEkspedisi();
      Alert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <div className="px-4 mt-5 sm:px-6 lg:px-8">
        <div className="sm:flex-auto mb-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Manage Ekspedisi
          </h1>
        </div>
        <Stack direction="row" mb={4}>
          <Button
            backgroundColor="black"
            color="white"
            onClick={handleOpenModal}
            sx={{
              transition: "background-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#3c3c3c",
              },
            }}
          >
            Add Ekspedisi
          </Button>
        </Stack>

        <AddEkspedisiModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          fetchEkspedisi={fetchEkspedisi}
        />
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
                        Ekspedisi
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
                    {ekspedisi?.map((el) =>
                      el.category !== "no category" ? (
                        <tr key={el.id} className="flex justify-between ">
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            {el.name}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <ButtonGroup mr={"39px"}>
                              <IconButton
                                variant="link"
                                color="red"
                                backgroundColor="#F9FAFB"
                                padding="10px"
                                borderRadius="50px"
                                _hover={{
                                  backgroundColor: "red",
                                  color: "white",
                                }}
                                onClick={() => confirmDeleteEkspedisi(el.id)}
                                icon={<DeleteIcon />}
                              />
                            </ButtonGroup>
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
