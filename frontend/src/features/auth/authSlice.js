import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    userData : null,
    isAuthenticated: !!localStorage.getItem('accessToken'), // Check if token exists on load
}

const authSlice = createSlice({

    name : "auth",

    initialState,
    
    reducers: {
        login : (state,action) => {
            state.isAuthenticated = true;
            state.userData = action.payload;
        },
        logout : (state) => {
            state.isAuthenticated = false
            state.userData = null;
            localStorage.removeItem('accessToken'); // Clear the token on logout
        }
    }
})

export const {login,logout} = authSlice.actions;

export default authSlice.reducer;