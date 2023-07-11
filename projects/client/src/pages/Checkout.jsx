import {useState, useEffect} from "react";
import {api} from "../API/api";
import AddressModal from "../components/AddressModal";
import {AddAddressModal} from "../components/AddAddressModal";
import {Ekspedisi} from "../components/Ekspedisi";
import {apiro} from "../API/apiro";
import {useNavigate} from "react-router-dom";
import {updateCart} from "../features/cartSlice";
import {useDispatch} from "react-redux";
import CartCheckout from "../components/CartCheckout";
import {CheckoutTotalSection} from "../components/CheckoutTotalSection";
import Alert from "../components/SwallAlert";
import CheckoutShippingSection from "../components/CheckoutShippingSection";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // Total jumlah pembelian
  const [subTotal, setSubtotal] = useState(0); // Total jumlah subTotal
  const [warehouseOrigin, setWarehouseOrigin] = useState("");
  const [ongkir, setOngkir] = useState(0);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [isOngkirLoading, setOngkirIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  console.log(`ini cart items`, cartItems);

  const addressId = selectedAddress?.id;
  useEffect(() => {
    const fetchOngkir = async () => {
      try {
        setOngkirIsLoading(true);
        if (warehouseOrigin && selectedAddress) {
          let totalWeight = 0;
          cartItems.forEach((cartItem) => {
            const productWeight = cartItem.Product.weight_g;
            const quantity = cartItem.quantity;
            const productTotalWeight = productWeight * quantity;
            totalWeight += productTotalWeight;
          });
          console.log(`ini total weight`, totalWeight);

          const response = await apiro.post("rajaongkir/ongkir", {
            origin: warehouseOrigin.warehouse_city_id,
            destination: selectedAddress.address_city_id,
            weight: totalWeight,
            courier: selectedDeliveryMethod.name,
          });
          const ongkirValue =
            response.data.data.results[0].costs[1].cost[0].value;
          setOngkir(ongkirValue);
        }
      } catch (error) {
        console.log(error);
        setOngkirIsLoading(false);
      } finally {
        setOngkirIsLoading(false);
      }
    };
    fetchOngkir();
  }, [selectedAddress, selectedDeliveryMethod]);

  const handleSelectDeliveryMethod = async (method) => {
    setSelectedDeliveryMethod(method);
  };

  const getUser = JSON.parse(localStorage.getItem("auth"));
  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const storedSelectedAddress = localStorage.getItem("selectedAddress");
        if (storedSelectedAddress) {
          setSelectedAddress(JSON.parse(storedSelectedAddress));
        } else {
          const response = await api.get(`/addresses/${getUser.id}`);
          const addresses = response.data;
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(
              (address) => address.is_default === true
            );
            if (defaultAddress) {
              setSelectedAddress(defaultAddress);
            } else {
              setSelectedAddress(addresses[0]);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchShippingAddress();
  }, []);

  useEffect(() => {
    const fetchLocalStorageCartItems = () => {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    };
    const subTotal = JSON.parse(localStorage.getItem("subTotal"));
    setSubtotal(subTotal);
    const fetchNearestWarehouse = async () => {
      try {
        let response = await api.get(`nearest-warehouse/${addressId}`);
        setWarehouseOrigin(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNearestWarehouse();
    fetchLocalStorageCartItems();
  }, [selectedAddress, addressId]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      setOngkirIsLoading(true);
      await api.post("/order", {
        cartItems: cartItems,
        productQty: cartItems.quantity,
        addressId: selectedAddress.id,
        userId: 2, // Masih hardcode
        totalAmount: totalAmount,
        ongkir,
        ekspedisiId: selectedDeliveryMethod.id,
      });
      setCartItems([]);
      dispatch(updateCart({cart: []}));
      localStorage.removeItem("cartItems");
      localStorage.removeItem("selectedAddress");
      navigate("/transactions");
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.response.data.error,
        icon: "error",
      });
      console.log("Error creating order:", error);
    } finally {
      setOngkirIsLoading(false);
    }
  };

  useEffect(() => {
    const calculateTotalAmount = () => {
      let subtotal = 0;
      for (const item of cartItems) {
        subtotal += item.Product.price * item.quantity;
      }
      setTotalAmount(subtotal + ongkir);
    };
    calculateTotalAmount();
  }, [cartItems, ongkir]);
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <h1 className="sr-only">Checkout</h1>
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <CartCheckout cartItems={cartItems} />
          </section>
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <CheckoutShippingSection
              selectedAddress={selectedAddress}
              openAddressModal={openAddressModal}
              openAddAddressModal={openAddAddressModal}
            />
            <Ekspedisi onSelectDeliveryMethod={handleSelectDeliveryMethod} />
            <div>
              <CheckoutTotalSection
                subTotal={subTotal}
                totalAmount={totalAmount}
                handleCheckout={handleCheckout}
                ongkir={ongkir}
                isOngkirLoading={isOngkirLoading}
              />
            </div>
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
