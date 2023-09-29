import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {baseURL} from "constant/index";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  state: "",
  status: null,
  loading: false,
  error: "",
};

const api = `${baseURL}/api/services/`;

export const DeleteServicesHandler = createAsyncThunk(
  "ServicesData/DeleteServicesHandler",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg._id, {
        headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return {
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

const ServicesSlice = createSlice({
  name: "ServicesData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DeleteServicesHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.status = action.payload.status;
        state.state = "Success";
        state.error = "";
        state.loading = false;
      } else {
        state.status = action.payload.status;
        state.loading = false;
        state.state = "Error";
        state.error = action.payload.message;
      }
    });
    builder.addCase(DeleteServicesHandler.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.status = null;
      state.state = "Pending";
    });
    builder.addCase(DeleteServicesHandler.rejected, (state) => {
      state.loading = false;
      state.error = "Server Error";
      state.state = "Rejected";
      state.status = 500;
    });
  },
});

export default ServicesSlice.reducer;