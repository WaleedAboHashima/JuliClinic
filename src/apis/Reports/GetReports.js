import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseURL } from "constant/index";
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

const api = `${baseURL}/api/accountant/report?type=`;

export const GetReportsHandler = createAsyncThunk(
  "ReportData/GetReportsHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api + arg.type,
        {
          day: arg.day,
          month: arg.month,
          year: arg.year,
        },
        {
          headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` },
        }
      );
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

const GetReportsSlice = createSlice({
  name: "ReportData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetReportsHandler.fulfilled, (state, action) => {
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
    builder.addCase(GetReportsHandler.pending, (state) => {
      state.loading = true;
      state.state = "Pending";
      state.data = [];
      state.status = null;
      state.error = "";
    });
    builder.addCase(GetReportsHandler.rejected, (state) => {
      state.loading = false;
      state.state = "Rejected";
      state.data = [];
      state.status = 500;
      state.error = "Server Error";
    });
  },
});

export default GetReportsSlice.reducer;
