import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeFeed: (state, action) => {
            if (!state || !state.users) return state;
            
            return {
                ...state,
                users: state.users.filter((user) => user.userId !== action.payload)
            };
        }
    }
});
export const{addFeed,removeFeed} = feedSlice.actions
export default feedSlice.reducer