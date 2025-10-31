import api from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Actions
export const fetchRatings = createAsyncThunk(
  'rating/fetchAll',
  async ({ 
    page = 1, 
    limit = 10, 
    search = "", 
    sortField = "", 
    sortOrder = "",
    stars = "",
    dateFilter = ""
  }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (sortField) params.sortField = sortField;
      if (sortOrder) params.sortOrder = sortOrder;
      if (stars) params.stars = stars;
      if (dateFilter) params.dateFilter = dateFilter;
      
      const response = await api.get('http://localhost:3000/api/rating', {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }   
  }
);

export const getRatingById = createAsyncThunk(
  'rating/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`http://localhost:3000/api/rating/details/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred'
      );
    }
  }
);

export const getRatingsByPack = createAsyncThunk(
  'rating/getByPack',
  async (packId, { rejectWithValue }) => {
    try {
      const response = await api.get(`http://localhost:3000/api/rating/pack/${packId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred'
      );
    }
  }
);

export const deleteRating = createAsyncThunk(
  'rating/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`http://localhost:3000/api/rating/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rating');
    }
  }
);

// Initial State
const initialState = {
  ratings: [],
  selectedRating: null,
  loading: false,
  ratingLoading: false,
  deleteLoading: {},
  error: null,
  success: false,
  currentPage: 1,
  totalPages: 0,
  count: 0,
  limit: 10,
  searchValue: "",
  sortField: "",
  sortOrder: "",
  starsFilter: "",
  dateFilter: "",
};

// Slice
const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSortConfig: (state, action) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setStarsFilter: (state, action) => {
      state.starsFilter = action.payload;
      state.currentPage = 1;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
      state.currentPage = 1;
    },
    clearSelectedRating: (state) => {
      state.selectedRating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ratings
      .addCase(fetchRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings;
        state.count = action.payload.count;
        state.currentPage = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get rating by ID
      .addCase(getRatingById.pending, (state) => {
        state.ratingLoading = true;
        state.error = null;
      })
      .addCase(getRatingById.fulfilled, (state, action) => {
        state.ratingLoading = false;
        state.selectedRating = action.payload;
      })
      .addCase(getRatingById.rejected, (state, action) => {
        state.ratingLoading = false;
        state.error = action.payload;
      })

      // Delete rating
      .addCase(deleteRating.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.deleteLoading[action.payload] = false;
        state.ratings = state.ratings.filter(rating => rating._id !== action.payload);
        state.count = Math.max(0, state.count - 1);
        state.success = true;
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.deleteLoading[action.meta.arg] = false;
        state.error = action.payload;
      });
  }
});

export const { 
  resetStatus, 
  setSearchValue, 
  setCurrentPage, 
  setSortConfig, 
  setStarsFilter,
  setDateFilter,
  clearSelectedRating
} = ratingSlice.actions;

export default ratingSlice.reducer;