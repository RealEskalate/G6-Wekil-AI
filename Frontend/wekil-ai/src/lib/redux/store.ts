import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice"
import agreementReducer from './slices/agreementsSlice'
import notificationReducer from './slices/notificationsSlice'
import authReducer from "./slices/authSlice";
import { setupListeners } from '@reduxjs/toolkit/query'
import { AgreementGetApi } from "./slices/AgreementAPI/AgreementGetById";
import adminReducer from "./slices/adminSlice";

export const store  = configureStore({
    reducer: {
        auth: authReducer, 
        profile: profileReducer,
        agreement: agreementReducer,
        notification: notificationReducer,
        [AgreementGetApi.reducerPath]: AgreementGetApi.reducer,
        admin: adminReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AgreementGetApi.middleware)
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch)