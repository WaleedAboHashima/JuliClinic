import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "constant/index";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  data: [],
  state: "",
  status: null,
  loading: false,
  error: "",
};

const api = `${baseURL}/api/user/`;

export const EditUsersHandler = createAsyncThunk(
  "UserData/EditUsersHandler",
  async (arg) => {
    try {
      const response = await axios.patch(
        api + arg._id,
        { email: arg.email },
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

const EditUserSlice = createSlice({
  name: "UserData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(EditUsersHandler.fulfilled, (state, action) => {
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
    builder.addCase(EditUsersHandler.pending, (state) => {
      state.loading = true;
      state.data = [];
      state.error = "";
      state.status = null;
      state.state = "Pending";
    });
    builder.addCase(EditUsersHandler.rejected, (state) => {
      state.loading = false;
      state.data = [];
      state.error = "Server Error";
      state.state = "Rejected";
      state.status = 500;
    });
  },
});

export default EditUserSlice.reducer;
