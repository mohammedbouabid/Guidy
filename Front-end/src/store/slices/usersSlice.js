import api from "@/api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ 
    page = 1, 
    limit = 10, 
    search = "", 
    sort = "", 
    order = "", 
    dateFilter = "", 
    profileCompletionFilter = "",
    role = ""
  }, { rejectWithValue }) => {
    try {
      const params = { page, limit, search };
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (dateFilter) params.dateFilter = dateFilter;
      if (profileCompletionFilter) params.profileCompletionFilter = profileCompletionFilter;
      if (role) params.role = role;
      
      const response = await api.get("http://localhost:3000/api/user", {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to fetch user statistics (guides and clients count)
export const fetchUserStats = createAsyncThunk(
  "users/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("http://localhost:3000/api/user/stats", {
        withCredentials: true,
      });
      
      return {
        guidesCount: response.data.guidesCount,
        clientsCount: response.data.clientsCount,
        totalCount: response.data.totalCount
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch user stats" });
    }
  }
);

// Async thunk to get user by ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`http://localhost:3000/api/user/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch user details" });
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`http://localhost:3000/api/user/${userId}`, {
        withCredentials: true,
      });
      return { userId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete user" });
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    count: 0,
    guidesCount: 0,
    clientsCount: 0,
    totalUsersCount: 0,
    page: 1,
    limit: 10,
    loading: false,
    statsLoading: false,
    userLoading: false,
    deleteLoading: {},
    error: null,
    statsError: null,
    userError: null,
    deleteError: null,
  },
  reducers: {
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearUserError: (state) => {
      state.userError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.count = action.payload.count;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })
      // Get user by ID cases
      .addCase(getUserById.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userLoading = false;
        state.selectedUser = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload?.message || "Failed to fetch user details";
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading[action.payload.userId] = false;
        // Remove the deleted user from the list
        state.users = state.users.filter(user => user._id !== action.payload.userId);
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading[action.meta.arg] = false;
        state.deleteError = action.payload?.message || "Failed to delete user";
      })
      // Fetch user stats cases
      .addCase(fetchUserStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.guidesCount = action.payload.guidesCount;
        state.clientsCount = action.payload.clientsCount;
        state.totalUsersCount = action.payload.totalCount;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload?.message || "Failed to fetch user statistics";
      });
  },
});

export const { clearDeleteError, clearUserError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;