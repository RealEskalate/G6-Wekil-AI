import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice"
import agreementReducer from './slices/agreementsSlice'
import notificationReducer from './slices/notificationsSlice'
import authReducer from "./slices/authSlice";

export const store  = configureStore({
    reducer: {
        auth: authReducer, 
        profile: profileReducer,
        agreement: agreementReducer,
        notification: notificationReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;