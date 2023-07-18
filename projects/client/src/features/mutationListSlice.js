import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const mutationListSlice = createSlice({
  name: "mutation",
  initialState,
  reducers: {
    mutation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { mutation } = mutationListSlice.actions;
export default mutationListSlice.reducer;
