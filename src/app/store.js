import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import activateReducer from "./activate/activateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activate: activateReducer,
  },
});
