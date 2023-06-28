import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addressData: (state, action) => {
      // console.log(action.payload);
      state.value = action.payload;
      //   state.warehouse = action.payload.warehouse;
      //   state.province = action.payload.province;
      //   state.city = action.payload.city;
      //   state.warehouse_city_id = action.payload.warehouse_city_id;
      //   state.subdistrict = action.payload.subdistrict;
      //   state.zip = action.payload.zip;
      //   state.latitude = action.payload.latitude;
      //   state.longitude = action.payload.longitude;
    },
  },
});

export const { addressData } = addressSlice.actions;
export default addressSlice.reducer;
