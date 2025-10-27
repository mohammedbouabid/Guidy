import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Actions
export const fetchGuidePlaces = createAsyncThunk(
  'guidePlace/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/guide-places');
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
        headers: { 'Content-Type': 'multipart/form-data' }
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
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update place'
      );
    }
  }
);


export const deleteGuidePlace = createAsyncThunk(
  'guidePlace/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/guide-places/${id}`);
      return id; // Return the id for filtering in the reducer
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
  loading: false,
  error: null,
  success: false
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
    }
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
        state.places = action.payload;
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
      .addCase(deleteGuidePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGuidePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places = state.places.filter(place => place._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteGuidePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetStatus, setCurrentPlace } = guidePlaceSlice.actions;
export default guidePlaceSlice.reducer;