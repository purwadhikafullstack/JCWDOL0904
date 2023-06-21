import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  fullname: "",
  username: "",
  is_verified: "",
  user_image: "",
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // console.log(state, action);
      state.id = action.payload.id;
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.is_verified = action.payload.is_verified;
      state.user_image = action.payload.user_image;
      state.role = action.payload.role;
    },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
