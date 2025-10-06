import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {GET,POST, PUT, DELETE} from '../../../helper/api_helper';

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async (amount) => {
    const response = await POST(
      "/payment/create-payment-intent",
      {
        amount,
      }
    );
    return response.data;
  }
);

export const getKey = createAsyncThunk("payment/getKey", async () => {
  const response = await GET("/payment/get-key");
  console.log("Key response:", response);
  return response.data;
});

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await POST(
      "/payment/verify-payment",
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }
    );
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentIntent: null,
    key: null,
    verification: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.paymentIntent = null;
      state.key = null;
      state.verification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentIntent = action.payload;
      })
      .addCase(getKey.fulfilled, (state, action) => {
        state.key = action.payload;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verification = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;
