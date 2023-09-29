import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "constant";
import Cookies from "universal-cookie";

const initialState = {
  loading: false,
  error: null,
  state: null,
  status: null,
};
const cookies = new Cookies();
const api = `${baseURL}/api/accountant/bill`;

export const AddBillHandler = createAsyncThunk(
  "BillData/AddBillHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api,
        {
          name: arg.name,
          price: arg.price,
        },
        { headers: { Authorization: `Bearer ${cookies.get("_auth_token")}` } }
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        message: error.response.data.message,
        status: error.response.status,
      };
    }
  }
);

const BillsSlice = createSlice({
  name: "BillData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddBillHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 201) {
        state.loading = false;
        state.error = null;
        state.state = "Success";
        state.status = action.payload.status;
      } else {
        state.loading = false;
        state.error = action.payload.message;
        state.state = "Error";
        state.status = action.payload.status;
      }
    });
    builder.addCase(AddBillHandler.rejected, state => {
        state.loading = false;
        state.error = 'Server Error';
        state.status = 500;
        state.state = 'Rejected';
    })
    builder.addCase(AddBillHandler.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = null;
        state.state = 'Pending';
    })
  },
});


export default BillsSlice.reducer;