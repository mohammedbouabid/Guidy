// src/store/slices/AuthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// -------------------- REGISTER --------------------
export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/api/signup", formData, {
        withCredentials: true,
      })
      return res.data // backend should return { message: "Account created" }
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Erreur inconnue")
    }
  }
)

// -------------------- LOGIN --------------------
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", formData, {
        withCredentials: true,
      })
      return res.data // backend should return { user, tokens }
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Erreur inconnue")
    }
  }
)

// -------------------- LOGOUT --------------------
export const LogoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/api/logout", null, {
        withCredentials: true, // 👈 this sends cookies
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed")
    }
  }
)

// -------------------- SLICE --------------------
const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null, // 👈 used for register success
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
    hydrateUserFromCookie: (state, action) => {
      state.user = action.payload
    }

  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.success = action.payload.message || "Account created successfully"
        // ❌ do NOT set user or localStorage here
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // LOGIN
      .addCase(LoginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // LOGOUT
      .addCase(LogoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.error = null
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearSuccess, hydrateUserFromCookie } = AuthSlice.actions
export default AuthSlice.reducer