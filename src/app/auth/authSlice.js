import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendOtp, verifyOtp } from "../../http";

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

export const verifyOtpAsync = createAsyncThunk(
  "auth/verifyOtp",
  async (data) => {
    try {
      const response = await verifyOtp(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      console.log(action.payload);
      const { user } = action.payload;
      state.user = user;
      state.isAuth = true;
    },
    setUser(state, action) {
      console.log(action.payload);
      state.user = action.payload.data.user;
      state.isAuth = action.payload.data.auth;
    },
  },
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
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.isAuth = true;
          state.user = action.payload.data.user;
          state.error = "";
          state.status = "idle";
        } else if (action.payload.response.status === 400) {
          state.isAuth = false;
          state.user = null;
          state.error = action.payload.response.data;
          state.status = "idle";
        }
      })
      .addCase(verifyOtpAsync.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { setAuth, setUser } = authSlice.actions;

export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;
export const selectPhone = (state) => state.auth.phoneNumber;
export const selectOtp = (state) => state.auth.otp;
export const selectHashToken = (state) => state.auth.hashToken;
export const selectUser = (state) => state.auth.user;
export const selectIsAuth = (state) => state.auth.isAuth;

export default authSlice.reducer;
