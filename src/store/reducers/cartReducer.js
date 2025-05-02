import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removeCart,removeFromCart, getCart, updateCartItem, addToCart as addToCartApi } from "../../api/cart";

const initialState = {
    cart: null,
    status: "idle",
    error: null,
  };
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ snackId, quantity, token }, { rejectWithValue }) => {
    try {
        const response = await updateCartItem(snackId, quantity, token);
        return { snackId, quantity }; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update quantity");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({token}, { rejectWithValue }) => {
    try {
      const response = await getCart(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({snackId, token}, { rejectWithValue }) => {
    try {
      const res = await removeFromCart(snackId, token);
      return snackId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove item");
    }
  }
);

export const removeAllCart = createAsyncThunk(
    "cart/removeAllCart",
    async ({token}, { rejectWithValue }) => {
        try {
          const res = await removeCart(token);
          return res;
        } catch (error) {
          return rejectWithValue(error.response?.data || "Failed to remove item");
        }
      }
)

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ SnackId, quantity, token }, { rejectWithValue }) => {
    try {
      const response = await addToCartApi(SnackId, quantity, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add item to cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.cart?.items) {
          state.cart.items = state.cart.items.filter(
            item => item.snackId._id !== action.payload
          );
        }
        state.cart.totalPrice = state.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { snackId, quantity } = action.payload;
        const item = state.cart?.items?.find(
          item => item.snackId._id === snackId
        );
        if (item) {
          item.quantity = quantity;
        }
        state.cart.totalPrice = state.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(removeAllCart.fulfilled, (state) => {
        state.cart = { items: [] };
        state.status = "succeeded";
      });
  }
});

export default cartSlice.reducer;