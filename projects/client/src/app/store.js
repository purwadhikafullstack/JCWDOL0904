import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice.js";

export default configureStore({
    reducer: {
        userSlice,
    },
});
