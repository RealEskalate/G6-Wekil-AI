import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Person {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  telephone?: string;
  address?: string;
  profileImage?: string;
  signature?: string;
  accountType?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileState {
  user: Person | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return String(error);
};

// GET user profile
export const fetchProfile = createAsyncThunk<
  Person,
  string,
  { rejectValue: string }
>("profile/fetchProfile", async (accessToken, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = response.data.data;
    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      telephone: data.telephone,
      address: data.address,
      profileImage: data.profile_image,
      signature: data.signature,
      accountType: data.account_type,
      isVerified: data.is_verified,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// PUT update profile
export const updateProfileApi = createAsyncThunk<
  { message: string },
  { accessToken: string; profileData: Partial<Person> },
  { rejectValue: string }
>("profile/updateProfileApi", async ({ accessToken, profileData }, { rejectWithValue }) => {
  try {
    // Map keys to backend format
    const payload = {
      first_name: profileData.first_name,
      middle_name: profileData.middle_name,
      last_name: profileData.last_name,
      telephone: profileData.telephone,
      address: profileData.address,
      profile_image: profileData.profileImage,
      signature: profileData.signature,
    };

    const response = await axios.put(`${API_URL}/api/users/profile`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message: response.data.message };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ------------------- Slice -------------------

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Person>) => {
      state.user = action.payload;
    },
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch profile";
    });

    // Update profile
    builder.addCase(updateProfileApi.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(updateProfileApi.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (state.user) state.user = { ...state.user, ...state.user }; // keep old values, can merge if needed
    });
    builder.addCase(updateProfileApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update profile";
    });
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
