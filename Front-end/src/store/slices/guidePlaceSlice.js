import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Actions
export const fetchGuidePlaces = createAsyncThunk(
  'guidePlace/fetchAll',
  async ({ 
    page = 1, 
    limit = 10, 
    search = "", 
    sortField = "", 
    sortOrder = "",
    city = "",
    country = ""
  }, { rejectWithValue }) => {
    try {
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI2YWVkNzA3OGY3ODM2ZGU5MzZkNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTUwODA1NCwiZXhwIjoxNzYxNTExNjU0fQ.2FzI5Fx4S_pZlkiMps56GG5CaricVYCZD6xkQ6TxDVw";
      document.cookie = `accessToken=${accessToken}; path=/; samesite=lax`;
      
      const params = { page, limit };
      if (search) params.search = search;
      if (sortField) params.sortField = sortField;
      if (sortOrder) params.sortOrder = sortOrder;
      if (city) params.city = city;
      if (country) params.country = country;
      
      const response = await axios.get('http://localhost:3000/api/guide-places', {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);

export const createGuidePlace = createAsyncThunk(
  'guidePlace/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/guide-places', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);

export const updateGuidePlace = createAsyncThunk(
  'guidePlace/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/guide-places/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);

export const getGuidePlaceById = createAsyncThunk(
  'guidePlace/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/guide-places/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);

export const deleteGuidePlace = createAsyncThunk(
  'guidePlace/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/guide-places/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);

// Initial State
const initialState = {
  places: [],
  currentPlace: null,
  selectedPlace: null,
  loading: false,
  placeLoading: false,
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
  cityFilter: "",
  countryFilter: "",
};

// Slice
const guidePlaceSlice = createSlice({
  name: 'guidePlace',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    setCurrentPlace: (state, action) => {
      state.currentPlace = action.payload;
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
    setCityFilter: (state, action) => {
      state.cityFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setCountryFilter: (state, action) => {
      state.countryFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all places
      .addCase(fetchGuidePlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuidePlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
        state.count = action.payload.count;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchGuidePlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get place by ID
      .addCase(getGuidePlaceById.pending, (state) => {
        state.placeLoading = true;
        state.error = null;
      })
      .addCase(getGuidePlaceById.fulfilled, (state, action) => {
        state.placeLoading = false;
        state.selectedPlace = action.payload;
      })
      .addCase(getGuidePlaceById.rejected, (state, action) => {
        state.placeLoading = false;
        state.error = action.payload;
      })

      // Create place
      .addCase(createGuidePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuidePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places.push(action.payload);
        state.success = true;
      })
      .addCase(createGuidePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update place
      .addCase(updateGuidePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGuidePlace.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.places.findIndex(place => place._id === action.payload._id);
        if (index !== -1) {
          state.places[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateGuidePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete place
      .addCase(deleteGuidePlace.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteGuidePlace.fulfilled, (state, action) => {
        state.deleteLoading[action.payload] = false;
        state.places = state.places.filter(place => place._id !== action.payload);
        state.count = Math.max(0, state.count - 1);
        state.success = true;
      })
      .addCase(deleteGuidePlace.rejected, (state, action) => {
        state.deleteLoading[action.meta.arg] = false;
        state.error = action.payload;
      });
  }
});

export const { 
  resetStatus, 
  setCurrentPlace, 
  setSearchValue, 
  setCurrentPage, 
  setSortConfig, 
  setCityFilter, 
  setCountryFilter,
  clearSelectedPlace
} = guidePlaceSlice.actions;
export default guidePlaceSlice.reducer;