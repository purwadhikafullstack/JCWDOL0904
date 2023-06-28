import { XMarkIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { cart, subtotal } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { SunDim } from "phosphor-react";

const Cart2 = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCartItems = async () => {
    try {
      const id = JSON.parse(localStorage.getItem("auth")).id;
      console.log(id);
      const response = await api.get(`/cart?userId=${id}`);
      console.log(response);
      setCartItems(response.data);
      console.log(response.data);

      let sum = 0;
      response.data.forEach((e) => (sum += e.quantity * e.Product.price));
      setTotalPrice(sum);

      dispatch(
        cart({
          cart: response.data,
        })
      );

      dispatch(
        subtotal({
          subtotal: sum,
        })
      );

      localStorage.setItem("cartItems", JSON.stringify(response.data));
      localStorage.setItem("subTotal", JSON.stringify(sum));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateCartProduct = async (cartItemId, action) => {
    setLoading(true);
    try {
      const response = await api.patch(`/cart/update`, {
        cartItemId,
        action,
      });
      console.log(response.data);
      const updatedItems = cartItems.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: response.data.quantity,
          };
        }
        return item;
      });
      setCartItems(updatedItems);
      fetchCartItems();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this item from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "black",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/cart/${cartItemId}`);
          fetchCartItems();
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  return (
    <div className="bg-white min-h-[700px] pt-10">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {cartItems.map((item) => {
                const subtotal = item.quantity * item.Product.price;
                return (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={item.Product.product_image}
                        alt={item.name}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={item.href}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.Product.product_name}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.size}</p>
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              Rp. {item.Product.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {item.price}
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
                              onClick={() =>
                                updateCartProduct(item.id, "decrease")
                              }
                            >
                              -
                            </button>
                            <input
                              id=""
                              name=""
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-12 text-center border border-gray-300"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                              onClick={() =>
                                updateCartProduct(item.id, "increase")
                              }
                            >
                              +
                            </button>
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => deleteCartItem(item.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
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
                          Subtotal: Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  Rp. {totalPrice.toLocaleString("id-ID")}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                onClick={() => navigate("/checkout")}
                type="submit"
                className="w-full rounded-full border border-transparent bg-gray-950 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue to Checkout
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Cart2;
