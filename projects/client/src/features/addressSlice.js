import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addressData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addressData } = addressSlice.actions;
export default addressSlice.reducer;
