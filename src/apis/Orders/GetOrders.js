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

const api = `${baseURL}/api/clients/orders`;

export const GetOrdersHandler = createAsyncThunk(
  "OrdersData/GetOrdersSlice",
  async (arg) => {
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

const OrderSlice = createSlice({
  name: "OrdersData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetOrdersHandler.fulfilled, (state, action) => {
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
    builder.addCase(GetOrdersHandler.rejected, (state) => {
      state.loading = false;
      state.date = [];
      state.error = "Server error";
      state.status = 500;
      state.state = "Rejected";
    });
    builder.addCase(GetOrdersHandler.pending, (state) => {
      state.loading = true;
      state.data = [];
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default OrderSlice.reducer;
