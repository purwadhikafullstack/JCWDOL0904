import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const allUserSlice = createSlice({
  name: "allUser",
  initialState,
  reducers: {
    allUserData: (state, action) => {
      console.log(state, action);
      state.value = action.payload;
    },
  },
});

export const { allUserData } = allUserSlice.actions;
export default allUserSlice.reducer;
