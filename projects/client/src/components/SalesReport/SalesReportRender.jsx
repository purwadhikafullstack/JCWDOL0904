import { Button, Select, Spinner, Stack } from "@chakra-ui/react";
import React from "react";
import ProductSearch from "../admin/ProductSearch";
import OrderWarehouseDropdown from "../admin/OrderWarehouseDropdown";
import ProductCategoryDropdown from "../admin/ProductCategoryDropdown";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../admin/Pagination";
import OrderDetailModal from "../admin/OrderDetailModal";

function SalesReportRender(props) {
  return (
    <div className="mr-10 ml-10 py-10 items-center justify-center">
      {props.itemValue ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Sales Report
            </h1>
            <Stack direction={"row"} className="flex gap-3 pb-3 pt-5">
              <ProductSearch
                handleSearch={props.setProductSearch}
                productSearch={props.productSearch}
              />
            </Stack>
            <Stack direction="row">
              <OrderWarehouseDropdown
                user={props.user}
                handleWarehouseChange={props.setSelectedWarehouse}
                selectedWarehouse={props.selectedWarehouse}
                warehouses={props.warehouses}
              />
              <ProductCategoryDropdown
                handleCategoryChange={props.handleCategoryChange}
                selectedCategory={props.selectedCategory}
                category={props.category}
              />
            </Stack>
            <Stack direction="row" mt={2} alignItems="center">
              <Select
                placeholder=""
                width="160px"
                display="flex"
                justifyContent="center"
                borderRadius="50px"
                className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => props.handleSorting(e.target.value)}
              >
                <option value="1">Newest Date</option>
                <option value="2">Oldest Date</option>
                <option value="3">Price low - high</option>
                <option value="4">Price high - low</option>
              </Select>
              <ReactDatePicker
                selected={
                  props.selectedDateRange
                    ? props.selectedDateRange.startDate
                    : null
                }
                onChange={props.handleDateRangeChange}
                dateFormat="dd/MM/yyyy"
                selectsRange
                placeholderText="Select a date range"
                startDate={
                  props.selectedDateRange
                    ? props.selectedDateRange.startDate
                    : null
                }
                endDate={
                  props.selectedDateRange
                    ? props.selectedDateRange.endDate
                    : null
                }
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <Button
                onClick={props.handleDateRangeReset}
                backgroundColor="black"
                color="white"
                _hover={{ backgroundColor: "#3c3c3c" }}
              >
                Reset date
              </Button>
            </Stack>
          </div>
          <div className="mt-6 flex flex-col justify-end xl">
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
                          Product
                        </th>

                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Transaction Date
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Warehouse
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Item Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {props.ProductMap}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end xl">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <tfoot>
                      <tr>
                        <td className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-semibold text-left text-gray-900">
                          ALL Transaction:
                        </td>
                        <td></td>
                        <td className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-bold text-right text-gray-900">
                          {`Rp ${parseInt(props.totalPrice).toLocaleString()}`}
                        </td>
                      </tr>
                    </tfoot>
                    <tfoot>
                      <tr>
                        <td className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-semibold text-left text-gray-900">
                          Transaction Filtered:
                        </td>
                        <td></td>
                        <td className="whitespace-nowrap px-2 py-2 pr-4 text-sm font-bold text-right text-gray-900">
                          {`Rp ${parseInt(
                            props.transactionByMonth
                          ).toLocaleString()}`}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            totalPages={props.totalPage}
            handlePageChange={props.handlePage}
          />
          <OrderDetailModal
            isDetailModalOpen={props.isDetailModalOpen}
            closeDetailModal={props.closeDetailModal}
            selectedTransaction={props.selectedTransaction}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default SalesReportRender;
