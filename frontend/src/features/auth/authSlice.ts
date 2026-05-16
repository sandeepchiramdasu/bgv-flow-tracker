import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, getCurrentUser } from "./authAPI";

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
  // add other fields if returned by getCurrentUser
}

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  role: localStorage.getItem("role") as "admin" | "verifier" | "viewer" | null,
  // Parse user from localStorage if it exists
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) as User : null,
  isAuthenticated: !!localStorage.getItem("access"),
  loading: false,
  error: null as string | null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: any, { rejectWithValue }) => {
    try {
      const tokenRes = await loginAPI(data);

      localStorage.setItem("access", tokenRes.access);
      localStorage.setItem("refresh", tokenRes.refresh);

      // 🔥 Fetch user immediately to get username and role
      const userRes = await getCurrentUser();

      localStorage.setItem("role", userRes.role);
      // Store user object stringified in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userRes));

      return {
        access: tokenRes.access,
        refresh: tokenRes.refresh,
        role: userRes.role,
        user: userRes, // Now returning the full user object
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.access = null;
      state.refresh = null;
      state.role = null;
      state.user = null; // Clear user on logout
      state.isAuthenticated = false;

      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.role = action.payload.role;
        state.user = action.payload.user; // Set user object in state
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;