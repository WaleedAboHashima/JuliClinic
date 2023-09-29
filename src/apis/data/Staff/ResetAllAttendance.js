import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {baseURL} from "constant/index";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  status: null,
  state: "",
  loading: false,
  error: "",
};

const api = `${baseURL}/api/user/att/section?type=`;

export const ResetAllAttendanceHandler = createAsyncThunk(
  "EmployeeData/ResetAllAttendanceHandler",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg.type, {
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

const ResetAllAttendanceSlice = createSlice({
    name: "EmployeeData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ResetAllAttendanceHandler.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload.status === 200) {
                state.loading = false;
                state.status = action.payload.status;
                state.state = "Success";
                state.error = "";
            }
            else {
                state.loading = false;
                state.status = action.payload.status;
                state.error = action.payload.message;
                state.state = "Error";
            }
        })
        builder.addCase(ResetAllAttendanceHandler.rejected, state => {
            state.loading = false;
            state.state = "Rejected";
            state.status = 500;
            state.error = "Server Error";
        })
        builder.addCase(ResetAllAttendanceHandler.pending, state => {
            state.loading = true;
            state.error = "";
            state.state = "";
            state.status = null;
        })
    }
})


export default ResetAllAttendanceSlice.reducer;