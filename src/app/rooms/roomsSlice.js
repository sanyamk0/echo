import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createRoom, getAllRooms, getRoom } from "../../http";

const initialState = {};

export const createRoomAsync = createAsyncThunk(
  "rooms/createRoom",
  async (data) => {
    try {
      const response = await createRoom(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllRoomsAsync = createAsyncThunk(
  "rooms/getAllRooms",
  async () => {
    try {
      const response = await getAllRooms();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getRoomAsync = createAsyncThunk(
  "rooms/getRoom",
  async (roomId) => {
    try {
      const response = await getRoom(roomId);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
});

export default roomsSlice.reducer;
