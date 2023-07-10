import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const transactionItemSlice = createSlice({
  name: "transactionItem",
  initialState,
  reducers: {
    transactionItemData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { transactionItemData } = transactionItemSlice.actions;
export default transactionItemSlice.reducer;
