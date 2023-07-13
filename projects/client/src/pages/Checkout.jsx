import {useState, useEffect} from "react";
import {api} from "../API/api";
import {apiro} from "../API/apiro";
import {useNavigate} from "react-router-dom";
import {updateCart} from "../features/cartSlice";
import {useDispatch} from "react-redux";
import Alert from "../components/SwallAlert";
import CheckoutRender from "../components/CheckoutRender";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const [warehouseOrigin, setWarehouseOrigin] = useState("");
  const [ongkir, setOngkir] = useState(0);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [isOngkirLoading, setOngkirIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openAddressModal = () => {
    setAddressModalOpen(true);
    setTimeout(() => {
      setAddressModalOpen(true);
    }, 10);
  };
  const closeAddressModal = () => {
    setAddressModalOpen(false);
    setTimeout(() => {
      setAddressModalOpen(false);
    }, 300);
  };
  const openAddAddressModal = () => {
    setAddAddressModalOpen(true);
    setTimeout(() => {
      setAddAddressModalOpen(true);
    }, 10);
  };
  const closeAddAddressModal = () => {
    setAddAddressModalOpen(false);
    setTimeout(() => {
      setAddAddressModalOpen(false);
    }, 300);
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressModalOpen(false);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

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
      const userId = JSON.parse(localStorage.getItem("auth")).id;
      await api.post("/order", {
        cartItems: cartItems,
        productQty: cartItems.quantity,
        addressId: selectedAddress.id,
        userId: userId,
        totalAmount: totalAmount,
        ongkir,
        ekspedisiId: selectedDeliveryMethod.id,
        courier: selectedDeliveryMethod.name,
      });
      setCartItems([]);
      dispatch(updateCart({cart: []}));
      localStorage.removeItem("cartItems");
      localStorage.removeItem("selectedAddress");
      localStorage.removeItem("subTotal");
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
    <CheckoutRender
      cartItems={cartItems}
      selectedAddress={selectedAddress}
      openAddressModal={openAddressModal}
      openAddAddressModal={openAddAddressModal}
      subTotal={subTotal}
      totalAmount={totalAmount}
      handleCheckout={handleCheckout}
      ongkir={ongkir}
      isOngkirLoading={isOngkirLoading}
      isAddressModalOpen={isAddressModalOpen}
      isAddAddressModalOpen={isAddAddressModalOpen}
      setSelectedAddress={setSelectedAddress}
      closeAddressModal={closeAddressModal}
      handleSelectAddress={handleSelectAddress}
      closeAddAddressModal={closeAddAddressModal}
      handleSelectDeliveryMethod={handleSelectDeliveryMethod}
    />
  );
}
