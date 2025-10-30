import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Récupérer tous les bookings (Admin)
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAll",
  async ({ page = 1, limit = 10, userId, packId, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (userId) params.userId = userId;
      if (packId) params.packId = packId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const res = await api.get("/bookings/all", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bookings");
    }
  }
);

// Récupérer les bookings d'un guide
export const fetchGuideBookings = createAsyncThunk(
  "booking/fetchGuideBookings",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/bookings/guide", { params: { page, limit } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch guide bookings");
    }
  }
);

// Récupérer un booking par ID
export const fetchBookingById = createAsyncThunk(
  "booking/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch booking");
    }
  }
);

// Créer un booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await api.post("/bookings", bookingData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create booking");
    }
  }
);

// Annuler un booking
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/bookings/cancel/${bookingId}`);
      return { ...res.data, bookingId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel booking");
    }
  }
);

// Récupérer les statistiques mensuelles avec filtres
export const fetchMonthlyStats = createAsyncThunk(
  "booking/fetchMonthlyStats",
  async ({ year, filterType, month, week } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (filterType) params.filterType = filterType;
      if (month) params.month = month;
      if (week) params.week = week;
      
      const res = await api.get("/bookings/stats/monthly", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch monthly stats");
    }
  }
);

const initialState = {
  items: [],
  current: null,
  monthlyStats: [],
  loading: false,
  error: null,
  success: false,
  page: 1,
  totalPages: 1,
  totalDocs: 0,
  limit: 10,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && payload.data && Array.isArray(payload.data)) {
          state.items = payload.data;
          state.totalDocs = payload.count || payload.data.length;
          state.page = 1;
          state.totalPages = Math.ceil((payload.count || payload.data.length) / state.limit);
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Guide Bookings
      .addCase(fetchGuideBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuideBookings.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && payload.data && Array.isArray(payload.data)) {
          state.items = payload.data;
          state.totalDocs = payload.count || payload.data.length;
          state.page = 1;
          state.totalPages = Math.ceil((payload.count || payload.data.length) / state.limit);
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchGuideBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Booking By ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (Array.isArray(state.items)) {
          state.items.unshift(action.payload.booking || action.payload);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Mettre à jour le booking dans la liste
        const idx = state.items.findIndex((b) => b._id === action.payload.bookingId);
        if (idx !== -1) {
          state.items[idx].isCancelled = true;
        }
        if (state.current && state.current._id === action.payload.bookingId) {
          state.current.isCancelled = true;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Monthly Stats
      .addCase(fetchMonthlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStats = action.payload.data || [];
      })
      .addCase(fetchMonthlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus, clearCurrent } = bookingSlice.actions;
export default bookingSlice.reducer;
