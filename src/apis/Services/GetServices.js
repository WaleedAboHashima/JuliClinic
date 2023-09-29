import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {baseURL} from "constant/index";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  data: [],
  loading: false,
  state: "",
  status: null,
  error: "",
};

const api = `${baseURL}/api/services/`;

export const GetServicesHandler = createAsyncThunk(
  "ServicesList/GetServicesHandler",
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

const GetServicesList = createSlice({
  name: "ServicesList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetServicesHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.state = "Success";
        state.error = "";
        state.status = action.payload.status;
      } else {
        state.data = [];
        state.loading = false;
        state.state = "Error";
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(GetServicesHandler.pending, (state) => {
      state.loading = true;
      state.state = "Pending";
      state.data = [];
      state.status = null;
      state.error = "";
    });
    builder.addCase(GetServicesHandler.rejected, (state) => {
      state.loading = false;
      state.state = "Rejected";
      state.data = [];
      state.status = 500;
      state.error = "Server Error";
    });
  },
});

export default GetServicesList.reducer;
