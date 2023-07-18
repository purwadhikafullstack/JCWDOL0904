import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    data: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { data } = warehouseSlice.actions;
export default warehouseSlice.reducer;
