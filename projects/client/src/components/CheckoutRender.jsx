import React from "react";
import CartCheckout from "../components/CartCheckout";
import CheckoutShippingSection from "../components/CheckoutShippingSection";
import AddressModal from "../components/AddressModal";
import {Ekspedisi} from "./Ekspedisi";
import {CheckoutTotalSection} from "./CheckoutTotalSection";
import {AddAddressModal} from "./AddAddressModal";

export default function CheckoutRender({
  cartItems,
  selectedAddress,
  openAddressModal,
  openAddAddressModal,
  subTotal,
  totalAmount,
  handleCheckout,
  ongkir,
  isOngkirLoading,
  isAddressModalOpen,
  isAddAddressModalOpen,
  closeAddressModal,
  handleSelectAddress,
  closeAddAddressModal,
  handleSelectDeliveryMethod,
}) {
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
                cartItems={cartItems}
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
