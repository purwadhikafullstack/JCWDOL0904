import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Cart() {
  const [productCart, setProductCart] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      image: "https://example.com/product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      image: "https://example.com/product2.jpg",
    },
    {
      id: 3,
      name: "Product 3",
      price: 5.99,
      image: "https://example.com/product3.jpg",
    },
  ]);

  const navigate = useNavigate();

  return (
    <>
      <div className="pt-24 h-max">
        {productCart.length !== 0 ? (
          <>
            {/* grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 md:justify-center px-5">
              {/* Card Start */}
              <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-5 lg:col-start-3 lg:col-end-9 lg:mr-3">
                {productCart.map((value, index) => (
                  <div className="border my-3 rounded-sm" key={value.id}>
                    <div className="md:border-b-2">
                      {/* Content Start */}
                      <div className="flex justify-between p-3 h-max md:h-[100px]">
                        <div className="flex items-center w-full">
                          <div className="flex justify-center bg-red-400">
                            <img
                              src={value.image}
                              alt="Product"
                              className="w-[60px]"
                            />
                          </div>
                          <div className="text-sm">
                            <div className="font-semibold text-neutral-600">
                              {value.name}
                            </div>
                            <div className="font-bold">
                              Price: Rp. {value.price.toLocaleString()}
                            </div>
                            <div className="pt-3">Subtotal: Rp 123,456</div>
                            <div className="flex md:hidden">
                              {/* Quantity buttons */}
                              <button className="w-8 h-8">-</button>
                              <div className="col-span-2 border-x w-14 h-8 text-xs flex justify-center items-center">
                                Quantity
                              </div>
                              <button className="w-8 h-8">+</button>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex gap-3">
                          {/* Quantity buttons */}
                          <button className="w-4">-</button>
                          <div className="col-span-2 border w-8 h-8 text-xs flex justify-center items-center bg-slate-200 border-neutral-300 rounded-sm">
                            Quantity
                          </div>
                          <button className="w-4">+</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="pl-5 py-3 text-sm text-gray-400 hover:text-gray-800 hidden md:block">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Card End */}

              <div className="hidden md:grid md:col-start-5 md:col-end-7 lg:col-start-9 lg:col-end-11 relative">
                <div className="px-5 sticky">
                  <div className="font-bold text-xl py-4 border-b-2">
                    CONTINUE
                  </div>
                  <div className="py-4 flex justify-between">
                    Total
                    <span className="font-bold">Rp. 20.000</span>
                  </div>
                  <button className="bg-neutral-900 text-white w-full py-1 rounded-sm">
                    BUY
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t-2 flex w-full justify-between bg-white z-10 fixed bottom-0 px-5 py-2 md:hidden">
              <div className="py-4">
                <span className="text-sm mr-1">Total</span>
                <span className="font-bold text-xl">Rp. 20.000</span>
              </div>
              <div className="flex items-center">
                <button className="bg-neutral-900 text-white px-7 py-1 rounded-sm">
                  BUY
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center my-14">
              <img src="sffjd" alt="Empty Cart" />
              <p className="text-xl font-semibold text-neutral-700 my-4">
                You don't have any items in the cart.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-black px-10 py-2 text-white font-semibold">
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <Toaster /> */}
    </>
  );
}
