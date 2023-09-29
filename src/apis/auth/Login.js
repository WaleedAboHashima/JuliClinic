import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {baseURL} from "constant/index";


const initialState = {
  data: {},
  status: null,
  error: "",
  loading: false,
  state: "",
};

const api = `${baseURL}/api/auth/login`;

export const LoginHandler = createAsyncThunk(
  "UserData/LoginHandler",
  async (arg) => {
    try {
      const res = await axios.post(api, {
        email: arg.email,
        pwd: arg.pwd,
      });

      return {
        data: res.data,
        status: res.status,
      };
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const LoginSlice = createSlice({
  name: "UserData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.loading = false;
        state.data = action.payload.data;
        state.error = "";
        state.state = "Success";
        state.status = action.payload.status;
      } else {
        state.loading = false;
        state.data = {};
        state.error = action.payload.message;
        state.state = "Error";
        state.status = action.payload.status;
      }
    });
    builder.addCase(LoginHandler.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.error = "";
      state.state = "Pending";
      state.status = null;
    });
    builder.addCase(LoginHandler.rejected, (state) => {
      state.loading = false;
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server Error";
      state.data = {};
    });
  },
});

export default LoginSlice.reducer;
