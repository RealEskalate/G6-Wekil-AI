import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Person {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    telephone?: string;
    address?: string;
    profileImage?: string;
    signature?: string;
}

interface ProfileState {
    user: Person | null;
}


const initialState: ProfileState  = {user: null}


const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<Person>) => {
            state.user = action.payload
        },
        updateProfile: (state, action:PayloadAction<Partial<Person>>) => {
            if(state.user) {
                state.user = {...state.user, ...action.payload}
            }
        },
        clearProfile: (state) => {
            state.user = null
        }
    }
})

export const {setProfile, updateProfile, clearProfile} = profileSlice.actions
export default profileSlice.reducer;