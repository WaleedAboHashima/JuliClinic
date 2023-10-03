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

export const AddOrdersHandler = createAsyncThunk(
  "OrdersData/AddOrdersHandler",
  async (arg) => {
    const api = `${baseURL}/api/clients/${arg.client_id}/order`;
    try {
      const response = await axios.post(
        api,
        {
          service_id: arg.selectedServices,
          amount_paid: arg.amountPaid,
          currency: arg.currency,
          assistances: arg.selectedAssistances,
          date: arg.date,
          time: arg.time,
          doctor_id: arg.selectedDoctor,
          addtionalInfo: arg.additionalInfo
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
        data: err.response.data.anthorTime
      
      };
    }
  }
);

const AddOrderSlice = createSlice({
  name: "OrdersData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddOrdersHandler.fulfilled, (state, action) => {
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
        state.error = action.payload.data;
      }
    });
    builder.addCase(AddOrdersHandler.rejected, (state) => {
      state.loading = false;
      state.date = {};
      state.state = "Rejected";
      state.status = 500;
      state.error = "Server Error";
    });
    builder.addCase(AddOrdersHandler.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default AddOrderSlice.reducer;
