import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = "http://localhost:3310/api";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data; // Return only the response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data.user; // Correct way to store user data
        state.token = action.payload.data.token; // Correctly storing token
        state.refreshToken = action.payload.data.refreshToken; // Store refresh token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
