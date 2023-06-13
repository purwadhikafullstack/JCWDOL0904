import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {api} from "../API/api";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {cart} = useSelector((state) => state.cartSlice.value);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/cart?userId=1`);
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShippingAddresses = async () => {
    try {
      const response = await api.get(`/addresses/2`);
      setShippingAddresses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchShippingAddresses();
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const renderAddress = (address) => {
    return (
      <div key={address.id} className="mb-4">
        <div className="flex gap-2">
          <span className="font-semibold">Recipient Name:</span>
          <span>{address.recipient_name}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">Phone Number:</span>
          <span>{address.phone_number}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">Province:</span>
          <span>{address.province}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">City:</span>
          <span>{address.city}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">Subdistrict:</span>
          <span>{address.subdistrict}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">ZIP:</span>
          <span>{address.zip}</span>
        </div>
        <button
          onClick={() => handleAddressSelect(address)}
          className={`mt-2 w-full rounded-md border border-transparent ${
            selectedAddress === address
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-500"
          } py-2 px-4 text-sm font-medium`}>
          {selectedAddress === address ? "Selected" : "Select"}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            {cartItems.map((item) => (
              // Render cart items
              <div key={item.id}>{/* Your cart item rendering code */}</div>
            ))}
          </section>

          <section className="mt-16 rounded-lg lg:col-span-5">
            <h2 className="text-lg font-medium text-gray-900">
              Shipping Address
            </h2>

            {shippingAddresses.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                You don't have any saved addresses. Please create a new address.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {shippingAddresses.map((address) => renderAddress(address))}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={!selectedAddress}
                className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white">
                Continue
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
