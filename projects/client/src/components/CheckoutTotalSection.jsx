import React from "react";
import {useNavigate} from "react-router-dom";

export const CheckoutTotalSection = ({
  handleCheckout,
  subTotal,
  totalAmount,
  ongkir,
}) => {
  const navigate = useNavigate();
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
              Rp. {subTotal.toLocaleString("id-ID")}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="text-gray-900">
              Rp. {ongkir ? ongkir.toLocaleString("id-ID") : 0}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
            <dt className="text-base">Total</dt>
            <dd className="text-base">
              Rp.{" "}
              {ongkir
                ? totalAmount.toLocaleString("id-ID")
                : subTotal.toLocaleString("id-ID")}
            </dd>
          </div>
        </dl>

        <button
          type="submit"
          className="mt-6 w-full rounded-full border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Checkout
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium shadow-sm ">
          Continue Shooping
        </button>
      </form>
    </div>
  );
};
