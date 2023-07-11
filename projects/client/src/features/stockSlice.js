import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    dataStock: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { dataStock } = stockSlice.actions;
export default stockSlice.reducer;
