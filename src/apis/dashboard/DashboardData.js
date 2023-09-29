import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {baseURL} from "constant/index";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  data: [],
  state: "",
  status: null,
  loading: false,
  error: "",
};

const api = `${baseURL}/api/accountant/dashboard`;

export const GetAllDataHandler = createAsyncThunk(
  "DashboardData/GetAllDataHandler",
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
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const DashboardSlice = createSlice({
  name: "DashboardData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAllDataHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.status = action.payload.status;
        state.state = "Success";
        state.error = "";
        state.loading = false;
      } else {
        state.data = [];
        state.status = action.payload.status;
        state.loading = false;
        state.state = "Error";
        state.error = action.payload.message;
      }
    });
    builder.addCase(GetAllDataHandler.pending, (state) => {
      state.loading = true;
      state.data = [];
      state.error = "";
      state.status = null;
      state.state = "Pending";
    });
    builder.addCase(GetAllDataHandler.rejected, (state) => {
      state.loading = false;
      state.data = [];
      state.error = "Server Error";
      state.state = "Rejected";
      state.status = 500;
    });
  },
});

export default DashboardSlice.reducer;
