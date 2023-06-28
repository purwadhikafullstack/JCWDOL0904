import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    AllCategory: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { AllCategory } = categorySlice.actions;
export default categorySlice.reducer;
