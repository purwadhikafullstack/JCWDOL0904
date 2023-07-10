import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transactionData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { transactionData } = transactionSlice.actions;
export default transactionSlice.reducer;
