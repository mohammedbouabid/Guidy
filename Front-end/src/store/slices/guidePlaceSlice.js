import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Actions
export const fetchGuidePlaces = createAsyncThunk(
  'guidePlace/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/guide-places');
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
      const response = await axios.post('/api/guide-places', formData, {
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
      const response = await axios.put(`/api/guide-places/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
      await axios.delete(`/api/guide-places/${id}`);
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