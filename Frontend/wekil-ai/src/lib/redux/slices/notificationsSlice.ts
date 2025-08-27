import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  type: "reminder" | "system" | "payment";
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  list: Notification[];
}

const initialState: NotificationsState = { list: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.list.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
