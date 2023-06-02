import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        id: 0,
        fullname: "",
        username: "Test",
        is_verified: "",
        user_image: "",
        role: "user",
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.id = action.payload.id;
            state.value.fullname = action.payload.fullname;
            state.value.is_verified = action.payload.is_verified;
            state.value.user_image = action.payload.user_image;
            state.value.role = action.payload.role;
        },
    }
})

export const { login } = userSlice.actions
export default userSlice.reducer