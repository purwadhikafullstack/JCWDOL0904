import { useState, useEffect } from "react";
import { api } from "../API/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { cart, subtotal } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import Alert from "../components/SwallAlert";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCartItems = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get(`/cart`, {
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setCartItems(response.data.cartItems);
      let sum = 0;
      response.data.cartItems.forEach(
        (e) => (sum += e.quantity * e.Product?.price)
      );
      setTotalPrice(sum);
      dispatch(
        cart({
          cart: response.data.cartItems,
        })
      );
      dispatch(
        subtotal({
          subtotal: sum,
        })
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(response.data.cartItems)
      );
      localStorage.setItem("subTotal", JSON.stringify(sum));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    removeDeletedCarts();
  }, []);

  const updateCartProduct = async (cartItemId, action, quantity) => {
    try {
      const response = await api.patch(`/cart`, {
        cartItemId,
        action,
        quantity,
      });
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
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  const removeDeletedCarts = async () => {
    try {
      const deletedCarts = cartItems.filter((item) => item.Product === null);
      if (deletedCarts.length > 0) {
        const cartItemIds = deletedCarts.map((item) => item.id);
        await api.put(`/cart/item`, { cartItemIds });
        localStorage.removeItem("cartItems");
        fetchCartItems();
      }
    } catch (error) {
      Alert({
        title: "Failed!",
        text: "Something went wrong",
        icon: "error",
      });
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
  const handleContinueToCheckout = () => {
    removeDeletedCarts();
    navigate("/checkout");
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
              {cartItems?.map((item) => {
                return (
                  <div>
                    {cartItems && (
                      <CartItem
                        key={item.id}
                        item={item}
                        updateCartProduct={updateCartProduct}
                        deleteCartItem={deleteCartItem}
                      />
                    )}
                    {!cartItems && <p>Cart is empty</p>}
                  </div>
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
                  Rp. {totalPrice ? totalPrice.toLocaleString("id-ID") : 0}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                onClick={handleContinueToCheckout}
                type="submit"
                className="w-full transition duration-300 ease-in-out  rounded-full border border-transparent bg-gray-950 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default Cart;
