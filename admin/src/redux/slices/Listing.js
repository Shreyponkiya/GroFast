import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GET, POST, PUT, DELETE } from "../../../helper/api_helper";
import {
  GET_DASHBOARD_STATS_API,
  GET_PRODUCT_LIST_API,
  GET_CATEGORY_LIST_API,
} from "../../../helper/url_helper";

export const fetchDashboardStats = createAsyncThunk(
  "listing/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET(GET_DASHBOARD_STATS_API);
      console.log("Dashboard Stats Response:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "listing/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET(GET_PRODUCT_LIST_API);
      console.log("Products Response:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "listing/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET(GET_CATEGORY_LIST_API);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchShopkeepers = createAsyncThunk(
  "listing/fetchShopkeepers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET("/superadmin/get-shopkeepers");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchDeliveryBoys = createAsyncThunk(
  "listing/fetchDeliveryBoys",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET("/superadmin/get-delivery-boys");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCustomerRequests = createAsyncThunk(
  "listing/fetchCustomerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET("/superadmin/get-customer-requests");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    dashboardStats: null, // <-- add this
    products: [],
    categories: [],
    shopkeepers: [],
    deliveryBoys: [],
    customerRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard stats";
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // Fetch Categories

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })

      // Fetch Shopkeepers
      .addCase(fetchShopkeepers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeepers.fulfilled, (state, action) => {
        state.loading = false;
        state.shopkeepers = action.payload;
      })
      .addCase(fetchShopkeepers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch shopkeepers";
      })

      // Fetch Delivery Boys
      .addCase(fetchDeliveryBoys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryBoys.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryBoys = action.payload;
      })
      .addCase(fetchDeliveryBoys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch delivery boys";
      });
  },
});
export default listingSlice.reducer;
