import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ========== EXISTING ACTIONS - KEEP AS IS ==========
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

// ========== NEW ACTIONS FOR ADMIN PAGE ==========

// Fetch bookings with advanced filters for admin
export const fetchBookingsAdmin = createAsyncThunk(
  "booking/fetchAdmin",
  async ({ 
    page = 1, 
    limit = 10, 
    search = "", 
    sortField = "", 
    sortOrder = "",
    isVip = "",
    statusFilter = "", // Combined status filter
    dateFilter = ""
  } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (sortField) params.sortField = sortField;
      if (sortOrder) params.sortOrder = sortOrder;
      if (isVip !== "") params.isVip = isVip;
      
      // Convert statusFilter to isCancelled and isCompleted params
      if (statusFilter === "cancelled") {
        params.isCancelled = "true";
      } else if (statusFilter === "completed") {
        params.isCompleted = "true";
      } else if (statusFilter === "active") {
        params.isCancelled = "false";
        params.isCompleted = "false";
      }
      
      if (dateFilter) params.dateFilter = dateFilter;
      
      const res = await api.get("/bookings/all", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

// Delete booking (admin only)
export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/bookings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete booking");
    }
  }
);

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  totalPages: 1,
  totalDocs: 0,
  limit: 10,
  // Admin page specific state
  searchValue: "",
  sortField: "",
  sortOrder: "",
  isVipFilter: "",
  statusFilter: "", // Combined: "active", "completed", "cancelled", or ""
  dateFilter: "",
  deleteLoading: {},
  selectedBooking: null,
  bookingLoading: false,
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
    // Admin page reducers
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.page = action.payload;
    },
    setSortConfig: (state, action) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setIsVipFilter: (state, action) => {
      state.isVipFilter = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
      state.page = 1;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
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
          state.page = payload.page || 1;
          state.limit = payload.limit || 10;
          state.totalPages = payload.totalPages || 1;
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
          state.page = payload.page || 1;
          state.limit = payload.limit || 10;
          state.totalPages = payload.totalPages || 1;
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

      // ========== ADMIN PAGE CASES ==========
      
      // Fetch Bookings Admin (with filters)
      .addCase(fetchBookingsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        if (payload && payload.success) {
          state.items = payload.data || [];
          state.totalDocs = payload.count || 0;
          state.page = payload.page || 1;
          state.limit = payload.limit || 10;
          state.totalPages = payload.totalPages || 1;
        } else if (payload && payload.data && Array.isArray(payload.data)) {
          state.items = payload.data;
          state.totalDocs = payload.count || payload.data.length;
          state.page = payload.page || 1;
          state.limit = payload.limit || 10;
          state.totalPages = payload.totalPages || 1;
        } else if (Array.isArray(payload)) {
          state.items = payload;
          state.totalDocs = payload.length;
          state.page = 1;
          state.limit = 10;
          state.totalPages = 1;
        } else {
          state.items = [];
          state.totalDocs = 0;
          state.page = 1;
          state.totalPages = 1;
        }
      })
      .addCase(fetchBookingsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      // Delete Booking
      .addCase(deleteBooking.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.deleteLoading[action.payload] = false;
        state.items = state.items.filter(booking => booking._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.deleteLoading[action.meta.arg] = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetStatus, 
  clearCurrent,
  setSearchValue,
  setCurrentPage,
  setSortConfig,
  setIsVipFilter,
  setStatusFilter,
  setDateFilter,
  clearSelectedBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;