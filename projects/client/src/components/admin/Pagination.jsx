import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ totalPages, handlePageChange }) => {
  const [isSmallerThan] = useMediaQuery("(max-width: 767px)");
  return (
    <div className="mt-6 flex justify-center">
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={handlePageChange}
        pageRangeDisplayed={isSmallerThan ? 3 : 5}
        pageCount={totalPages}
        previousLabel="< "
        renderOnZeroPageCount={null}
        containerClassName="flex justify-center items-center mb-10"
        pageLinkClassName="px-2 py-1 rounded-md m-1 hover:bg-gray-200"
        previousLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1 hover:bg-gray-200"
        nextLinkClassName="px-2 py-1 border border-gray-300 rounded-md m-1 hover:bg-gray-200"
        activeLinkClassName="px-2 py-1 bg-black text-white rounded-md m-1"
      />
    </div>
  );
};

export default Pagination;
