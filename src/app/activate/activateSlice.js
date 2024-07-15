import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setUser } from "../auth/authSlice";
import { activate } from "../../http";

const initialState = {
  name: "",
  avatar: "",
};

export const activateAccountAsync = createAsyncThunk(
  "activate/activateAccount",
  async (data, { dispatch }) => {
    try {
      const response = await activate(data);
      dispatch(setUser(response));
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const activateSlice = createSlice({
  name: "activate",
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
  },
});

export const { setName, setAvatar } = activateSlice.actions;

export const selectName = (state) => state.activate.name;
export const selectAvatar = (state) => state.activate.avatar;

export default activateSlice.reducer;
