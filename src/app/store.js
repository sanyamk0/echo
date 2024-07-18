import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import activateReducer from "./activate/activateSlice";
import roomsReducer from "./rooms/roomsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activate: activateReducer,
    rooms: roomsReducer,
  },
});
