import { createSlice } from '@reduxjs/toolkit';

let storedUser = null;

try {
  const rawUser = localStorage.getItem("user");
  storedUser = rawUser && rawUser !== "undefined"
    ? JSON.parse(rawUser)
    : null;
} catch (error) {
  localStorage.removeItem("user");
  storedUser = null;
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;