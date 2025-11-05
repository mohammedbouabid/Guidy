import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createPack = createAsyncThunk(
  "pack/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/packs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create pack");
    }
  }
);

export const fetchPacks = createAsyncThunk(
  "pack/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/packs", { params: { page, limit } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch packs");
    }
  }
);

export const fetchGuidePacks = createAsyncThunk(
  "pack/fetchGuidePacks",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/packs/all", { params: { page, limit } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch guide packs");
    }
  }
);

export const fetchFilteredPacks = createAsyncThunk(
  "pack/fetchFiltered",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/packs/filter", { params: filters });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to filter packs");
    }
  }
);

export const fetchPackById = createAsyncThunk(
  "pack/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/packs/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch pack");
    }
  }
);

export const updatePack = createAsyncThunk(
  "pack/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/packs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update pack");
    }
  }
);
export const deletePack = createAsyncThunk(
  "pack/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/packs/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete pack");
    }
  }
);

export const fetchMonthlyPackStats = createAsyncThunk(
  "pack/fetchMonthlyStats",
  async ({ year, filterType, month, week } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (filterType) params.filterType = filterType;
      if (month) params.month = month;
      if (week) params.week = week;
      console.log("🔄 Fetching pack stats with params:", params);
      const res = await api.get("/packs/stats/monthly", { params });
      console.log("✅ Pack stats response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching pack stats:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch monthly stats");
    }
  }
);

const initialState = {
  items: [],
  current: null,
  monthlyStats: [],
  loading: false,
  statsLoading: false,
  error: null,
  success: false,
  page: 1,
  totalPages: 1,
  totalDocs: 0,
  limit: 10,
};

const packSlice = createSlice({
  name: "pack",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPacks.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && Array.isArray(payload.docs)) {
          state.items = payload.docs;
          state.page = payload.page ?? 1;
          state.totalPages = payload.totalPages ?? 1;
          state.totalDocs = payload.totalDocs ?? payload.total ?? payload.docs.length ?? 0;
          state.limit = payload.limit ?? state.limit;
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchPacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGuidePacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuidePacks.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && Array.isArray(payload.docs)) {
          state.items = payload.docs;
          state.page = payload.page ?? 1;
          state.totalPages = payload.totalPages ?? 1;
          state.totalDocs = payload.totalDocs ?? payload.total ?? payload.docs.length ?? 0;
          state.limit = payload.limit ?? state.limit;
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchGuidePacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilteredPacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredPacks.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && Array.isArray(payload.docs)) {
          state.items = payload.docs;
          state.page = payload.page ?? 1;
          state.totalPages = payload.totalPages ?? 1;
          state.totalDocs = payload.totalDocs ?? payload.total ?? payload.docs.length ?? 0;
          state.limit = payload.limit ?? state.limit;
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchFilteredPacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPackById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchPackById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchPackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // optimistic add if list already loaded
        if (Array.isArray(state.items)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.current = action.payload;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updatePack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🗑️ DELETE PACK
      .addCase(deletePack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Supprimer le pack du tableau local
        state.items = state.items.filter((p) => p._id !== action.meta.arg);
      })
      .addCase(deletePack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 📊 FETCH MONTHLY STATS
      .addCase(fetchMonthlyPackStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPackStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.monthlyStats = action.payload.data || [];
      })
      .addCase(fetchMonthlyPackStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = packSlice.actions;
export default packSlice.reducer;
