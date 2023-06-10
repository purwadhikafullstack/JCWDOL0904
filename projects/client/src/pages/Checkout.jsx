import {useState} from "react";
import {api} from "../API/api";
import {useEffect} from "react";
import AddressModal from "../components/AddressModal";
import {AddAddressModal} from "../components/AddAddressModal";
import {Ekspedisi} from "../components/Ekspedisi";
import {apiro} from "../API/apiro";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // const {cart} = useSelector((state) => state.cartSlice.value);
  const [warehouseOrigin, setWarehouseOrigin] = useState("");
  const [ongkir, setOngkir] = useState(0);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  console.log(ongkir);
  console.log("ini ekspedisi", selectedDeliveryMethod);

  console.log("warehouseOrigin", warehouseOrigin);
  console.log("ini warehouse city id", warehouseOrigin.warehouse_city_id);
  console.log("ini address city id", selectedAddress?.address_city_id);
  console.log("destination", selectedAddress);

  const openAddressModal = () => {
    setAddressModalOpen(true);
  };
  const closeAddressModal = () => {
    setAddressModalOpen(false);
  };
  const openAddAddressModal = () => {
    setAddAddressModalOpen(true);
  };
  const closeAddAddressModal = () => {
    setAddAddressModalOpen(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressModalOpen(false);
    // Store the selected address in localStorage
    setSelectedAddress(address);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  const addressId = selectedAddress?.id;
  console.log("ini idaddress", addressId);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/cart?userId=1`);
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShippingAddress = async () => {
    try {
      // const storedAddress = localStorage.getItem("selectedAddress");
      // console.log(storedAddress);
      if (selectedAddress) {
        // setSelectedAddress(JSON.parse(storedAddress));
        setSelectedAddress(selectedAddress);
      } else {
        const response = await api.get(`/addresses/2`);
        const addresses = response.data;
        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]); // Set the first address as the selected address
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNearestWarehouse = async () => {
    try {
      let response = await api.get(`nearest-warehouse/${addressId}`);
      setWarehouseOrigin(response.data);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOngkir = async () => {
    try {
      let response = await apiro.post("rajaongkir/ongkir", {
        origin: warehouseOrigin.warehouse_city_id,
        destination: selectedAddress.address_city_id,
        weight: 1000,
        courier: selectedDeliveryMethod,
      });
      const ongkirValue = response.data.data.results[0].costs[1].cost[0].value;
      setOngkir(ongkirValue);
      console.log(response.data.data.results[0].costs[1].cost[0].value);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectDeliveryMethod = async (method) => {
    setSelectedDeliveryMethod(method);
    await fetchOngkir();
  };

  useEffect(() => {
    fetchShippingAddress();
    fetchNearestWarehouse();
    fetchCartItems();
  }, [addressId]);

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            {cartItems.map((item) => (
              <div className="mx-auto w-full max-w-lg" key={item.id}>
                <h2 className="sr-only">Order summary</h2>
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-t border-b border-gray-200">
                  <li key={item.Product.id} className="flex py-6 sm:py-10">
                    <img
                      src={
                        `http://localhost:8000/` + item.Product.product_image
                      }
                      alt={item.Product.product_name}
                      className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
                    />
                    <div className="flex-auto">
                      <div className="space-y-1 sm:flex sm:items-start items-center sm:justify-between sm:space-x-6">
                        <div className="flex-auto space-y-1 text-sm font-medium">
                          <h3 className="text-gray-900">
                            <a>{item.Product.product_name}</a>
                          </h3>
                          <p className="text-gray-900">{item.Product.price}</p>

                          <p className="hidden text-gray-500 sm:block text-sm font-thin">
                            {item.Product.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              <button
                type="button"
                disabled
                className="w-full cursor-auto py-4 text-left text-lg font-medium text-gray-500">
                Shipping address
              </button>
            </div>

            {selectedAddress ? (
              <div className="mt-4 text-sm text-gray-600">
                <div key={selectedAddress.id} className="mb-4">
                  <div className="flex gap-2">
                    <span className="font-semibold">Recipient Name:</span>
                    <span>{selectedAddress.recipient_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Phone Number:</span>
                    <span>{selectedAddress.phone_number}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Province:</span>
                    <span>{selectedAddress.province}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">City:</span>
                    <span>{selectedAddress.city}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Subdistrict:</span>
                    <span>{selectedAddress.subdistrict}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">ZIP:</span>
                    <span>{selectedAddress.zip}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>No shipping addresses found.</div>
            )}

            <button
              type="button"
              onClick={openAddressModal}
              className="mt-1 w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Change address
            </button>

            <button
              type="button"
              onClick={openAddAddressModal}
              className="mt-2 w-full rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Add Address
            </button>

            <Ekspedisi onSelectDeliveryMethod={handleSelectDeliveryMethod} />

            <div className="relative mt-8">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white rounded-md px-4 text-sm font-medium text-gray-500">
                  <p className="pb-1">ooo</p>
                </span>
              </div>
            </div>

            <form className="mt-6">
              <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">00</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-gray-900">{ongkir ? ongkir : 0}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">32</dd>
                </div>
              </dl>

              <button
                type="submit"
                className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Continue
              </button>
            </form>
            {isAddAddressModalOpen && (
              <div className="modal-overlay">
                <AddAddressModal closeAddressModal={closeAddAddressModal} />
              </div>
            )}
            <div className="shadow-lg">
              {isAddressModalOpen && (
                <AddressModal
                  selectedAddress={selectedAddress}
                  onSelectAddress={handleSelectAddress}
                  closeModal={closeAddressModal}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}