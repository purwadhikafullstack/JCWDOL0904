import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice.js";
import cartSlice from "../features/cartSlice.js";

export default configureStore({
    reducer: {
        userSlice,
        cartSlice
    },
});
