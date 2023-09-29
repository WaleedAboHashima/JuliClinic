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
const api = `${baseURL}/api/clients`;

export const AddClientHandler = createAsyncThunk(
  "ClientData/AddClientHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api,
        {
          firstName: arg.firstName,
          middleName: arg.middleName,
          lastName: arg.lastName,
          phone: arg.phone,
          country: arg.country
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

const AddClientSlice = createSlice({
  name: "ClientData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddClientHandler.fulfilled, (state, action) => {
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
    builder.addCase(AddClientHandler.rejected, (state) => {
      state.loading = false;
      state.date = {};
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server Error";
    });
    builder.addCase(AddClientHandler.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default AddClientSlice.reducer;
