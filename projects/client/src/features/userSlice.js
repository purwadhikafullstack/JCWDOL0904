import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  fullname: "",
  username: "",
  is_verified: "",
  user_image: "",
  role: "",
  id_warehouse: 0,
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log(state, action);
      state.id = action.payload.id;
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.is_verified = action.payload.is_verified;
      state.user_image = action.payload.user_image;
      state.role = action.payload.role;
      state.id_warehouse = action.payload.id_warehouse;
      state.email = action.payload.email;
    },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
