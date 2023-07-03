import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice.js";
import cartSlice from "../features/cartSlice.js";
import warehouseSlice from "../features/warehouseSlice.js";
import mutationListSlice from "../features/mutationListSlice.js";
import addressSlice from "../features/addressSlice.js";
import categorySlice from "../features/categorySlice.js";
import allUserSlice from "../features/allUserSlice.js";
import transactionSlice from "../features/transactionSlice.js";

export default configureStore({
  reducer: {
    userSlice,
    cartSlice,
    warehouseSlice,
    mutationListSlice,
    addressSlice,
    categorySlice,
    allUserSlice,
    transactionSlice,
  },
});
