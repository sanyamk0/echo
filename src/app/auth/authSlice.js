import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout, sendOtp, verifyOtp } from "../../http";

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
      return error;
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await logout();
    return response;
  } catch (err) {
    console.log(err);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { user, auth } = action.payload;
      state.user = user;
      state.isAuth = auth;
    },
    setUser(state, action) {
      const { user, auth } = action.payload.data;
      state.user = user;
      state.isAuth = auth;
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
          const { user, auth } = action.payload.data;
          state.isAuth = auth;
          state.user = user;
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
      })
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        const { user, auth } = action.payload;
        state.user = user;
        state.isAuth = auth;
        state.status = "idle";
      })
      .addCase(logoutAsync.rejected, (state) => {
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
