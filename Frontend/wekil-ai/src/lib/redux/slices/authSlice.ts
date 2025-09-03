import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  telephone?: string;
  accountType?: string;
  [key: string]: string | undefined;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  success: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Register
export const registerUser = createAsyncThunk<
  { data: { message: string }; success: boolean },
  Omit<User, "accountType"> & { accountType: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.data.error;
      } catch (e) {
        console.error('Error parsing error response JSON:', e);
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return JSON.parse(responseText);
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return rejectWithValue(getErrorMessage(error));
  }
});

// Login
export const loginUser = createAsyncThunk<
  { data: User & { message: string }; success: boolean }, // Updated return type
  { email: string; password: string; rememberMe?: boolean },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData; 
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.user?.accessToken;

      if (!token) {
        console.warn("No access token found, skipping backend logout");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const changePassword = createAsyncThunk<
  { data?: { message: string }; success: boolean; error?: string },
  { old_password: string; new_password: string, token: string },
  { rejectValue: string; state: { auth: AuthState } }
>(
  "auth/changePassword",
  async ({ old_password, new_password, token }, { rejectWithValue }) => {
    try {

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password, new_password }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        const errorMsg =
          data.error || data.data?.message || "Failed to change password";
        return rejectWithValue(errorMsg);
      }

      return data as { data: { message: string }; success: boolean };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error)
      );
    }
  }
);


// forgot Password
export const forgotPassword = createAsyncThunk<
  { data: { message: string }; success: boolean },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// reset Password
export const resetPassword = createAsyncThunk<
  { data: { message: string }; success: boolean },
  { email: string; otp: string; new_password: string },
  { rejectValue: string }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const verifyOtp = createAsyncThunk<
  { data: { message?: string; error?: string }; success: boolean },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const refreshToken = createAsyncThunk<
  { data: { accessToken: string; refreshToken: string }; success: boolean },
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.data.message;
      state.success = action.payload.success;
      state.user = { email: action.meta.arg.email! };
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration failed";
      state.success = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.message = action.payload.data.message;
      state.success = action.payload.success;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
      state.success = false;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.message = "Logged out successfully";
      state.success = true;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload || "Logout failed";
      state.success = false;
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.data.message;
      state.success = action.payload.success;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Forgot password failed";
      state.success = false;
    });

    // change password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.data?.message || null;;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || "Failed to change password";
    });


    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.data.message;
      state.success = action.payload.success;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Reset password failed";
      state.success = false;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.data.message || action.payload.data.error || null;
      state.success = action.payload.success;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "OTP verification failed";
      state.success = false;
    });

    // Refresh Token
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      if (state.user) {
        state.user.accessToken = action.payload.data.accessToken;
      }
      state.success = action.payload.success;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.error = action.payload || "Token refresh failed";
      state.success = false;
    });
  },
});

export const { clearState, setUser, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;