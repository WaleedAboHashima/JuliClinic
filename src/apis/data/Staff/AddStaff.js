import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {baseURL} from "constant/index";
import axios from "axios";
import Cookies from "universal-cookie";

const initialState = {
  date: {},
  loading: false,
  error: "",
  status: null,
  state: "",
};

const cookies = new Cookies();
const api = `${baseURL}/api/user/staff?type=`;

export const AddStaffHandler = createAsyncThunk(
  "StaffData/AddStaffHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api + arg.type,
        {
          name: arg.name,
          salary: arg.salary,
          percentage: arg.percentage,
          way: arg.way,
          email: arg.email,
          pwd: arg.pwd,
        },
        { headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` } }
      );
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

const AddStaffSlice = createSlice({
  name: "StaffData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddStaffHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 201) {
        state.data = action.payload.data;
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = "";
      } else {
        state.loading = false;
        state.data = {};
        state.state = "Error";
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(AddStaffHandler.rejected, (state) => {
      state.loading = false;
      state.date = {};
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server Error";
    });
    builder.addCase(AddStaffHandler.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default AddStaffSlice.reducer;
