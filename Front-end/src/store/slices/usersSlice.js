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
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI2YWVkNzA3OGY3ODM2ZGU5MzZkNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTQ4MDI4MywiZXhwIjoxNzYxNDgzODgzfQ.RQrAamcuTqBrR5XsZ2FA2eGVGcYAPW8immhYtV6M53k";
      document.cookie = `accessToken=${accessToken}; path=/; samesite=lax`;
      
      const params = { page, limit, search };
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (dateFilter) params.dateFilter = dateFilter;
      if (profileCompletionFilter) params.profileCompletionFilter = profileCompletionFilter;
      if (role) params.role = role;
      
      const response = await axios.get("http://localhost:3000/api/user", {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to get user by ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${userId}`, {
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
      const response = await axios.delete(`http://localhost:3000/api/user/${userId}`, {
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
    page: 1,
    limit: 10,
    loading: false,
    userLoading: false,
    deleteLoading: {},
    error: null,
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
      });
  },
});

export const { clearDeleteError, clearUserError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;