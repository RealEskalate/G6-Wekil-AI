import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

interface NotificationsState {
  list: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "https://g6-wekil-ai-1.onrender.com/api/users/notification?page=1&limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.error || "Failed to fetch notifications");
      }

      if (data.success === false) {
        return { notifications: [] };
      }

      return { notifications: data.notifications || [] };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.notifications;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
