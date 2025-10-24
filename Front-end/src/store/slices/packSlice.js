import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const createPack = createAsyncThunk(
  'pack/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/packs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create pack');
    }
  }
);

export const fetchPacks = createAsyncThunk(
  'pack/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/packs');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch packs');
    }
  }
);

export const fetchPackById = createAsyncThunk(
  'pack/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/packs/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pack');
    }
  }
);

export const updatePack = createAsyncThunk(
  'pack/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/packs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update pack');
    }
  }
);

export const deletePack = createAsyncThunk(
  'pack/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/packs/${id}`);
      return id; // Return the id for filtering in the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pack');
    }
  }
);

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  success: false,
};

const packSlice = createSlice({
  name: 'pack',
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
        state.items = action.payload?.docs || action.payload || [];
      })
      .addCase(fetchPacks.rejected, (state, action) => {
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
      .addCase(deletePack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePack.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(pack => pack._id !== action.payload);
        state.success = true;
      })
      .addCase(deletePack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = packSlice.actions;
export default packSlice.reducer;
