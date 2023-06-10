import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        cart: []
    }
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cart: (state, action) => {
            state.value.cart = action.payload.cart;
        },
    }
})

export const { cart } = cartSlice.actions
export default cartSlice.reducer