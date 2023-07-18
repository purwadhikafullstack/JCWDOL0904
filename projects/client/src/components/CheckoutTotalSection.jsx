import React from "react";
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import {css} from "@emotion/react";

export const CheckoutTotalSection = ({
  handleCheckout,
  subTotal,
  totalAmount,
  ongkir,
  isOngkirLoading,
}) => {
  const navigate = useNavigate();

  const spinnerStyles = css`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 5px;
  `;

  return (
    <div>
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="rounded-md px-4 text-sm font-medium text-gray-500">
            <p className="pb-1">ooo</p>
          </span>
        </div>
      </div>

      <form onSubmit={handleCheckout}>
        <dl className="mt-5 space-y-6 text-sm font-medium text-gray-500">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="text-gray-900">
              Rp. {subTotal?.toLocaleString("id-ID")}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="text-gray-900">
              Rp. {ongkir ? ongkir?.toLocaleString("id-ID") : 0}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
            <dt className="text-base">Total</dt>
            <dd className="text-base">
              Rp.{" "}
              {ongkir
                ? totalAmount?.toLocaleString("id-ID")
                : subTotal?.toLocaleString("id-ID")}
            </dd>
          </div>
        </dl>

        {isOngkirLoading ? (
          <button
            type="submit"
            className="mt-6 w-full rounded-full border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled>
            <span className="inline-flex items-center">
              <PulseLoader
                size={10}
                css={spinnerStyles}
                color="currentColor"
                loading={true}
              />
              <span className="ml-2">Loading</span>
            </span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isOngkirLoading}
            className="mt-6 w-full rounded-full hover:shadow-md transition duration-300 ease-in-out border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Checkout
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full hover:shadow-md hover:ring-2 hover:ring-black rounded-full border border-transparent transition duration-300 ease-in-out py-2 px-4 text-sm font-medium shadow-sm ">
          Continue Shooping
        </button>
      </form>
    </div>
  );
};
