import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(window.localStorage.getItem('user'));

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    token: storedUser?.token || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Save to localStorage
      window.localStorage.setItem('user', JSON.stringify(action.payload));
    },
    removeUser: (state) => {
      state.user = null;
      state.token = null;

      // Remove from localStorage
      window.localStorage.removeItem('user');
    },
  }
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
