import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    cart: [],
    subtotal: 0,
  },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cart: (state, action) => {
      state.value.cart = action.payload.cart;
    },
    updateCart: (state, action) => {
      state.value.cart = action.payload.cart;
    },
    subtotal: (state, action) => {
      state.value.subtotal = action.payload.subtotal;
    },
  },
});

export const { cart, updateCart, subtotal } = cartSlice.actions;
export default cartSlice.reducer;
