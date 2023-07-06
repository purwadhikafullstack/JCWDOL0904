import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({totalPages, handlePageChange}) => {
  return (
    <div className="mt-6 flex justify-center">
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageChange}
        pageRangeDisplayed={5}
        pageCount={totalPages}
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

export default Pagination;
