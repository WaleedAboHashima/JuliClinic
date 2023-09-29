import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { baseURL } from "./../../../constant/index";

const initialState = {
  data: [],
  loading: false,
  error: "",
  state: "",
  status: null,
};

const cookies = new Cookies();

export const GetStaffOrderHandler = createAsyncThunk(
  "StaffOrderData/GetStaffOrderHandler",
  async (arg) => {
    const api = `${baseURL}/api/user/staff/orders/${arg._id}?type=${arg.type}`;
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
        error: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const StaffOrderDataSlice = createSlice({
  name: "StaffOrderData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetStaffOrderHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.error = "";
        state.status = action.payload.status;
        state.state = "Success";
      } else {
        state.data = [];
        state.loading = false;
        state.error = action.payload.error;
        state.status = action.payload.status;
        state.state = "Error";
      }
    });
    builder.addCase(GetStaffOrderHandler.rejected, (state) => {
      state.loading = false;
      state.data = [];
      state.status = null;
      state.error = "Server Error";
      state.state = "Rejected";
    });
    builder.addCase(GetStaffOrderHandler.pending, (state) => {
      state.loading = true;
      state.data = [];
      state.status = null;
      state.error = "";
      state.state = "Pending";
    });
  },
});


export default StaffOrderDataSlice.reducer;