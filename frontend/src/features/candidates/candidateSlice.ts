import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCandidates, getCandidateById, createCandidate } from "./candidateAPI";
import type { Candidate } from "../../types";
import type { RootState } from "../../app/store";

// ✅ STATE TYPE
interface CandidateState {
  list: Candidate[];
  selected: Candidate | null;
  loading: boolean;
}

// ✅ INITIAL STATE
const initialState: CandidateState = {
  list: [],
  selected: null,
  loading: false,
};

// ✅ FETCH ALL CANDIDATES
export const fetchCandidates = createAsyncThunk(
  "candidates/fetch",
  async () => {
    return await getCandidates();
  }
);

// ✅ FETCH SINGLE CANDIDATE
export const fetchCandidateById = createAsyncThunk(
  "candidates/fetchOne",
  async (id: number) => {
    return await getCandidateById(id);
  }
);

// ✅ CREATE NEW CANDIDATE
export const createCandidateThunk = createAsyncThunk(
  "candidates/create",
  async (candidateData: { name: string; phone_number: string; work_email: string }) => {
    return await createCandidate(candidateData);
  }
);

// ✅ UPDATE REMARKS THUNK (With Auth Header)
export const updateCandidateRemarks = createAsyncThunk(
  "candidates/updateRemarks",
  async (
    {
      id,
      remarks,
      internal_remarks,
    }: {
      id: number;
      remarks?: string;
      internal_remarks?: string;
    },
    { getState }
  ) => {
    const state = getState() as RootState;

    const token =
      state.auth?.access || localStorage.getItem("access_token");

    const response = await axios.patch(
      `http://127.0.0.1:8000/api/candidates/${id}/`,
      {
        remarks,
        internal_remarks,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

// ✅ SLICE
const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    // Clear selected candidate when leaving the detail page to prevent stale UI
    clearSelectedCandidate: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 FETCH ALL
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state) => {
        state.loading = false;
      })

      // 🔹 FETCH ONE
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state) => {
        state.loading = false;
      })

      // 🔹 CREATE CANDIDATE
      .addCase(createCandidateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCandidateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); 
      })

      // 🔹 UPDATE REMARKS (Real-time State Sync)
      .addCase(updateCandidateRemarks.fulfilled, (state, action) => {
        // 1. Update the 'selected' candidate view immediately
        if (state.selected && state.selected.id === action.payload.id) {
          state.selected = action.payload;
        }
        // 2. Update the candidate in the global list for the dashboard
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedCandidate } = candidateSlice.actions;
export default candidateSlice.reducer;