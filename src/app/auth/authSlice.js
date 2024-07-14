import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendOtp } from "../../http";

const initialState = {
  status: "idle",
  error: "",
  phoneNumber: "",
  otp: "",
  hashToken: "",
  user: null,
  isAuth: false,
};

export const sendOtpAsync = createAsyncThunk(
  "auth/sendOtp",
  async (phoneNumber) => {
    try {
      const response = await sendOtp({ phoneNumber });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendOtpAsync.fulfilled, (state, action) => {
        const { phoneNumber, otp, hashToken } = action.payload.data;
        state.phoneNumber = phoneNumber;
        state.otp = otp;
        state.hashToken = hashToken;
        state.status = "idle";
      })
      .addCase(sendOtpAsync.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;
export const selectPhone = (state) => state.auth.phoneNumber;
export const selectOtp = (state) => state.auth.otp;
export const selectHashToken = (state) => state.auth.hashToken;
export const selectUser = (state) => state.auth.user;
export const selectIsAuth = (state) => state.auth.isAuth;

export default authSlice.reducer;
