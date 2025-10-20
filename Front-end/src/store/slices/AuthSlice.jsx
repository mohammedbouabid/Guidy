import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

// 🔐 Login thunk — sends credentials, expects user info in response
export const LoginUser = createAsyncThunk(
  "Auth/LoginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", formData, {
        withCredentials: true, // 👈 sends cookies
      })

      // expects: { success, message, user }
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || "Erreur inconnue")
    }
  }
)

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialLoading: true,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
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
  },
})

export const { logout, clearError } = AuthSlice.actions
export default AuthSlice.reducer
