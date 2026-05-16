import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalytics } from "./analyticsAPI";

interface AnalyticsState {
  data: any;
  loading: boolean;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
};

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async () => {
    return await getAnalytics();
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default analyticsSlice.reducer;