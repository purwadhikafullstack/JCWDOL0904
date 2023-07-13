import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const stockHistorySlice = createSlice({
  name: "stockhistories",
  initialState,
  reducers: {
    stockHistoryData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { stockHistoryData } = stockHistorySlice.actions;
export default stockHistorySlice.reducer;
