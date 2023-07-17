import React from "react";

const CartCheckout = ({cartItems}) => {
  return (
    <>
      {cartItems?.map((item) => (
        <div className="mx-auto w-full max-w-lg" key={item?.id}>
          <h2 className="sr-only">Order summary</h2>
          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200">
            <li key={item.Product?.id} className="flex py-6 sm:py-10">
              <img
                src={item.Product?.product_image}
                alt={item.Product?.product_name}
                className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
              />
              <div className="flex-auto">
                <div className="space-y-1 sm:flex sm:items-start text-center sm:justify-between sm:space-x-6">
                  <div className="flex-auto space-y-1 text-sm font-medium">
                    <h3 className="text-gray-900">
                      <a>{item.Product?.product_name}</a>
                    </h3>

                    <p className="text-gray-900">
                      <p>Rp.{item.Product?.price.toLocaleString("id-ID")}</p>{" "}
                      <p className="font-normal">({item.quantity})</p>
                    </p>

                    <p className="hidden text-gray-500 sm:block text-sm font-thin">
                      {item.Product?.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default CartCheckout;
