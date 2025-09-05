import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice"
import agreementReducer from './slices/agreementsSlice'
import notificationReducer from './slices/notificationsSlice'
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";

export const store  = configureStore({
    reducer: {
        auth: authReducer, 
        profile: profileReducer,
        agreement: agreementReducer,
        notification: notificationReducer,
        admin: adminReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;