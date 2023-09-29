import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseURL } from "constant/index";
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
const api = `${baseURL}/api/user`;

export const AddUsersHandler = createAsyncThunk(
  "UserData/AddUsersHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api,
        {
          username: arg.username,
          email: arg.email,
          pwd: arg.password,
        },
        { headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` } }
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

const AddUserSlice = createSlice({
  name: "UserData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddUsersHandler.fulfilled, (state, action) => {
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
    builder.addCase(AddUsersHandler.rejected, (state) => {
      state.loading = false;
      state.date = {};
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server Error";
    });
    builder.addCase(AddUsersHandler.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default AddUserSlice.reducer;
