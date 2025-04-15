import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin as apiLogin, authRegister as apiRegister } from "../../api/auth";

export const login = createAsyncThunk("api/auth/login", async (formData, { rejectWithValue }) => {
  try {
    const data = await apiLogin(formData.email, formData.password);
    return {
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.log("🛑 Lỗi API login:", error.response);
    return rejectWithValue(
      error.response?.data?.message || error.message || "Đăng nhập thất bại!"
    );
  }
});
export const register = createAsyncThunk("api/auth/register", async (formData, { rejectWithValue }) => {
  try {
    const data = await apiRegister({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    return {
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || "Đăng ký thất bại!");
  }
});

const initialState = {
  user: null,
  loading: "idle",
  token: null, 
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = action.payload.user;  
        state.token = action.payload.token; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload || action.error?.message || "Unknown error";
      })
      .addCase(register.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;