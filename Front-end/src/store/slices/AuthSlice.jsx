// src/store/slices/AuthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// -------------------- LOGIN --------------------
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", formData, {
        withCredentials: true, // 👈 important for cookies
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Erreur inconnue")
    }
  }
)

// -------------------- LOGOUT --------------------
export const LogoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true })
      return true
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Erreur inconnue")
    }
  }
)

// -------------------- SLICE --------------------
const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // load from storage
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(LoginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        localStorage.setItem("user", JSON.stringify(action.payload.user)) // persist
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // LOGOUT
      .addCase(LogoutUser.fulfilled, (state) => {
        state.user = null
        state.error = null
        localStorage.removeItem("user") // clear storage
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = AuthSlice.actions
export default AuthSlice.reducer
