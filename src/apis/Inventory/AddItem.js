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
const api = `${baseURL}/api/accountant/inv/item`;

export const AddItemHandler = createAsyncThunk(
  "ItemsData/AddItemHandler",
  async (arg) => {
    try {
      const response = await axios.post(
        api,
        {
          kind: arg.kind,
          quantity: arg.quantity,
          company_name: arg.companyName,
          price: arg.price,
          notes: arg.notes,
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

const InventorySlice = createSlice({
  name: "ItemsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddItemHandler.fulfilled, (state, action) => {
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
    builder.addCase(AddItemHandler.rejected, (state) => {
      state.loading = false;
      state.error = "Server Error";
      state.status = 500;
      state.state = "Rejected";
    });
    builder.addCase(AddItemHandler.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = null;
      state.state = "Pending";
    });
  },
});

export default InventorySlice.reducer;
