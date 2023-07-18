import React, { useState } from "react";
import { XMarkIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import Alert from "./SwallAlert";

export const CartItem = ({ item, updateCartProduct, deleteCartItem }) => {
  const subtotal = item?.quantity * item?.Product?.price;
  const [inputQuantity, setInputQuantity] = useState(item?.quantity);
  const stock = item?.Product?.Stocks.reduce((totalStock, stockItem) => {
    return totalStock + stockItem.stock;
  }, 0);

  const handleDecrease = () => {
    if (inputQuantity > 1) {
      const newQuantity = inputQuantity - 1;
      setInputQuantity(newQuantity);
      updateCartProduct(item?.id, "decrease");
    }
  };

  const handleIncrease = () => {
    if (inputQuantity < stock) {
      const newQuantity = inputQuantity + 1;
      setInputQuantity(newQuantity);
      updateCartProduct(item?.id, "increase");
    } else {
      Alert({
        title: "Failed!",
        text: "Insufficient Stock",
        icon: "error",
      });
    }
  };
  const handleInputQuantity = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setInputQuantity(1);
      updateCartProduct(item?.id, "input", 1);
    } else if (newQuantity > stock) {
      setInputQuantity(stock);
      updateCartProduct(item?.id, "input", stock);
      Alert({
        title: "Failed!",
        text: "Insufficient Stock",
        icon: "error",
      });
    } else {
      setInputQuantity(newQuantity);
      updateCartProduct(item?.id, "input", newQuantity);
    }
  };
  const handleDelete = () => {
    deleteCartItem(item?.id);
  };

  return (
    <>
      {item ? (
        <li key={item?.id} className="flex py-6 sm:py-10">
          <div className="flex-shrink-0">
            <img
              src={`${process.env.REACT_APP_API_BASE}${item?.Product?.product_image}`}
              alt={`${process.env.REACT_APP_API_BASE}${item?.Product?.product_image}`}
              className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm">
                    <a
                      href={item?.href}
                      className="font-medium text-gray-700 hover:text-gray-800"
                    >
                      {item?.Product?.product_name}
                    </a>
                  </h3>
                </div>
                <div className="mt-1 flex text-sm">
                  <p className="text-gray-500">{item?.size}</p>
                  <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                    Rp. {item?.Product?.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {item?.price}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 sm:pr-9">
                <label htmlFor="" className="sr-only">
                  Quantity, product name
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    onClick={handleDecrease}
                  >
                    -
                  </button>
                  <input
                    id=""
                    name=""
                    type="text"
                    value={inputQuantity}
                    onChange={handleInputQuantity}
                    className="w-12 text-center border border-gray-300"
                  />

                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    onClick={handleIncrease}
                  >
                    +
                  </button>
                </div>

                <div className="absolute top-0 right-0">
                  <button
                    type="button"
                    className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                    onClick={handleDelete}
                  >
                    <span className="sr-only">Remove</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 flex space-x-2 text-sm text-gray-700">
              <CreditCardIcon
                className="h-5 w-5 flex-shrink-0 text-gray-700"
                aria-hidden="true"
              />
              <span>
                Subtotal: Rp{" "}
                {subtotal == "NaN" ? null : subtotal.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        </li>
      ) : (
        <p>Cart is empty</p>
      )}
    </>
  );
};
