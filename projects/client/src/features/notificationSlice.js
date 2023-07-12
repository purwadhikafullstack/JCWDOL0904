import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        unread: 0,
    },
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        unreadCount: (state, action) => {
            state.value.unread = action.payload.unread;
        },
    },
});

export const { unreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
