import React from "react";
import { Stack, Spinner, Select, Button } from "@chakra-ui/react";
import ProductSearch from "../admin/ProductSearch";
import OrderWarehouseDropdown from "../admin/OrderWarehouseDropdown";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../admin/Pagination";
import OrderDetailModal from "../admin/OrderDetailModal";

function StockHistoryRender(props) {
  return (
    <div className="mr-10 ml-10 py-10 items-center justify-center">
      {props.itemValue ? (
        <div>
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Stock History
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
              <Select
                placeholder=""
                width="120px"
                display="flex"
                justifyContent="center"
                borderRadius="50px"
                style={{ fontSize: "11px" }}
                onChange={(e) => props.handleSorting(e.target.value)}
              >
                <option value="1" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Newest Date
                </option>
                <option value="2" style={{ fontSize: "10px", borderRadius: 0 }}>
                  Oldest Date
                </option>
              </Select>
            </Stack>
            <Stack direction="row">
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
          <div className="mt-6 flex flex-col justify-center xl">
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
                          Date
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
                          Warehouse
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Stock In
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Stock Out
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Current Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {props.HistoryDataMap}
                    </tbody>
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

export default StockHistoryRender;
