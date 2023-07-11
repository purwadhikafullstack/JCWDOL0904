import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        unreadAdmin: 0,
    },
};

export const adminNotificationSlice = createSlice({
    name: "adminNotification",
    initialState,
    reducers: {
        unreadAdminCount: (state, action) => {
            state.value.unreadAdmin = action.payload.unreadAdmin;
        },
    },
});

export const { unreadAdminCount } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;
