import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

const api = `${baseURL}/api/user/staff/`;

export const DeleteStaffHandler = createAsyncThunk(
  "StaffData/DeleteStaffHandler",
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
        message: err.response.message,
        status: err.response.status,
      };
    }
  }
);

const DeleteStaffSlice = createSlice({
  name: "StaffData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DeleteStaffHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = "";
      } else {
        state.loading = false;
        state.state = "Error";
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(DeleteStaffHandler.rejected, (state) => {
      state.loading = false;
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server error";
    });
    builder.addCase(DeleteStaffHandler.pending, (state) => {
      state.loading = true;
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default DeleteStaffSlice.reducer;