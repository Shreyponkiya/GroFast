import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {GET,POST, PUT, DELETE} from '../../../helper/api_helper';
import { POST_CREATE_ORDER_API, } from "../../../helper/url_helper";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await POST('/order/placeOrder', orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      return rejectWithValue("Failed to create order");
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (placeOrderId, { rejectWithValue }) => {
    try {
      const response = await GET(`/order/getOrder/${placeOrderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return rejectWithValue("Failed to fetch order");
    }
  }
);