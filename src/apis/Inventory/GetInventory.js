import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "constant";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  data: [],
  loading: false,
  state: "",
  status: null,
  error: "",
};

const api = `${baseURL}/api/accountant/inv/item`;

export const GetInventoryHandler = createAsyncThunk(
  "InventoryData/GetInventoryHandler",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (err) {
      return {
        message: err.response.message,
        status: err.response.status,
      };
    }
  }
);

const InvetorySlice = createSlice({
  name: "InventoryData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetInventoryHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = "";
      } else {
        state.data = [];
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
        state.state = "Error";
      }
    });
    builder.addCase(GetInventoryHandler.rejected, (state) => {
      state.loading = false;
      state.date = [];
      state.error = "Server error";
      state.status = 500;
      state.state = "Rejected";
    });
    builder.addCase(GetInventoryHandler.pending, (state) => {
      state.loading = true;
      state.data = [];
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default InvetorySlice.reducer;
