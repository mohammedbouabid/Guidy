import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
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
      
      const params = { page, limit };
      if (search) params.search = search;
      if (sortField) params.sortField = sortField;
      if (sortOrder) params.sortOrder = sortOrder;
      if (city) params.city = city;
      if (country) params.country = country;
      
      const response = await api.get('/guide-places', {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }   
  }
);
export const fetchGuidePlacesForGuide = createAsyncThunk(
  'guidePlace/fetchForGuide',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/guide-places/all-places-guide');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }   
  }
);

export const createGuidePlace = createAsyncThunk(
  'guidePlace/create',
  async (formData, { rejectWithValue }) => {   
    try {
      const response = await api.post('/guide-places', formData, {
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
      const response = await api.put(`/guide-places/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // 🔥 important
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
      const response = await api.get(`/guide-places/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Une erreur est survenue'
      );
    }
  }
);


export const deleteGuidePlace = createAsyncThunk(
  'guidePlace/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/guide-places/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete place');
    }
  }
);

// Initial State
const initialState = {
  places: [],
  placesForGuide: [],
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
      .addCase(fetchGuidePlacesForGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuidePlacesForGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.placesForGuide = action.payload;
      })
      .addCase(fetchGuidePlacesForGuide.rejected, (state, action) => {
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
        const index = state.places.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.places[index] = action.payload.data;
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