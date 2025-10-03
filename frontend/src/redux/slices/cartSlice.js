import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createCart = createAsyncThunk(
  "cart/createCart",
  async ({ userId, cartItems, OrderId }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/cart/create-cart", {
        userId,
        cartItems,
        OrderId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/cart/add-item", {
        userId,
        productId,
        quantity,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



export const fetchCartByOrderId = createAsyncThunk(
  "cart/fetchCartByOrderId",
  async (OrderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/cart/get-cart/${OrderId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ OrderId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/cart/get-cart?OrderId=${OrderId}&userId=${userId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {},
    loading: false,
    error: null,
    currentOrderId: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { product } = action.payload;
      if (state.items[product._id]) {
        state.items[product._id].quantity += 1;
      } else {
        state.items[product._id] = { ...product, quantity: 1 };
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      const { product } = action.payload;
      if (state.items[product._id]) {
        state.items[product._id].quantity -= 1;
        if (state.items[product._id].quantity <= 0) {
          delete state.items[product._id];
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    setCartFromLocal: (state, action) => {
      state.items = action.payload || {};
    },
    clearCart: (state) => {
      state.items = {};
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = {};
        state.currentOrderId = action.payload.OrderId;
        localStorage.removeItem("cart");
      })
      .addCase(fetchCartByOrderId.fulfilled, (state, action) => {
        state.items = {};
        action.payload.products.forEach((p) => {
          state.items[p.productId._id] = {
            ...p.productId,
            quantity: p.quantity,
          };
        });
      })
    .addCase(fetchCart.fulfilled, (state, action) => {
  state.items = {};
  action.payload.products.forEach((p) => {
    state.items[p.productId._id] = { ...p.productId, quantity: p.quantity };
  });
  state.currentOrderId = action.payload.OrderId;
});

  },
});

export const { addItem, removeItem, setCartFromLocal, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
