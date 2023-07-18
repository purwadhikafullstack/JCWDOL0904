import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice.js";
import cartSlice from "../features/cartSlice.js";
import warehouseSlice from "../features/warehouseSlice.js";
import mutationListSlice from "../features/mutationListSlice.js";
import addressSlice from "../features/addressSlice.js";
import categorySlice from "../features/categorySlice.js";
import notificationSlice from "../features/notificationSlice.js";
import allUserSlice from "../features/allUserSlice.js";
import adminNotificationSlice from "../features/adminNotificationSlice.js";
import stockSlice from "../features/stockSlice.js";
import transactionSlice from "../features/transactionSlice.js";
import transactionItemSlice from "../features/transactionItemSlice.js";
import stockHistorySlice from "../features/stockHistorySlice.js";

export default configureStore({
  reducer: {
    userSlice,
    cartSlice,
    warehouseSlice,
    mutationListSlice,
    addressSlice,
    categorySlice,
    notificationSlice,
    allUserSlice,
    adminNotificationSlice,
    stockSlice,
    transactionSlice,
    transactionItemSlice,
    stockSlice,
    notificationSlice,
    adminNotificationSlice,
    stockHistorySlice,
  },
});
