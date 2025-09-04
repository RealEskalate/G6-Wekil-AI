// src/redux/slices/adminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define User type
export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  telephone?: string;
  address?: string;
  account_type: string;
  is_verified: boolean;
  profile_image?: string;
  signature?: string;
  created_at: string;
  updated_at: string;
  refresh_token?: string;
}

// Response shape
interface AdminUsersResponse {
  data: AdminUser[];
  limit: number;
  page: number;
  success: boolean;
  totalUsers: number;
}

interface AdminState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  page: number;
  limit: number;
}

// Initial state
const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,
  page: 1,
  limit: 10,
};

// Fetch users with fetch API
export const fetchAdminUsers = createAsyncThunk<
  AdminUsersResponse,
  { token: string; page?: number; limit?: number },
  { rejectValue: string }
>("admin/fetchUsers", async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    console.log("Fetching admin users with token:", token);
    const res = await fetch(`${API_URL}/api/admin/users?page=${page}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Failed to fetch users");
    }

    const data = (await res.json()) as AdminUsersResponse;
    return data;
  } catch (err: unknown) {
    console.error("Error fetching admin users:", err);
    return rejectWithValue("Failed to fetch users");
  }
});

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<AdminUsersResponse>) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalUsers = action.payload.totalUsers;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default adminSlice.reducer;
