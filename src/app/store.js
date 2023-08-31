import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authSlice from "../features/auth/authSlice";

console.log("reducer name : "+[apiSlice.reducerPath]);

export const store = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authSlice
    },
    middleware : getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools:true
    devTools:false
});

setupListeners(store.dispatch)