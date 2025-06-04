import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {GET,POST, PUT, DELETE} from '../../../helper/api_helper';

export const fetchProducts = createAsyncThunk(
  "products/fetchProductsByCategoryId",
  async ({}) => {
    console.log("Fatching data from API");
    const response = await GET(
      `/customer/get-products`
    );
    console.log("Silce response", response);
    return response.data;
  }
);

export const PostCartProduct = createAsyncThunk(
  "products/PostCartProduct",
  async ({ userId, cartItems, OrderId }) => {
    console.log("Fatching data from API");
    const response = await POST(
      `/cart/create-cart`,
      { userId, cartItems, OrderId }
    );
    console.log("Silce response", response);
    return response.data;
  }
);

export const GetCartProduct = createAsyncThunk(
  "products/GetCartProduct",
  async ({ OrderId }) => {
    console.log("Fatching data from API");
    console.log("Silce OrderId : ", OrderId);
    const response = await GET(
      `/cart/get-cart/${OrderId}`
    );
    console.log("Silce response", response);
    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
