import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Address {
  // Define address properties here based on your app's structure, e.g.:
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

interface User {
  // Define user properties you expect, example:
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  number?: string;
  avatar?: string;
  // Add other user fields as needed
}

interface UserState {
  currentUser: User | null;
  address: Address | null;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  address: null,
  isFetching: false,
  isError: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //default
    Start: (state) => {
      state.isError = false;
      state.isFetching = true;
      state.error = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.address = null;
    },
    resetError: (state) => {
      state.error = null;
      state.isError = false;
    },
    setAddress: (state, action: PayloadAction<Address | null>) => {
      state.address = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    //login
    loginSucces: (state, action: PayloadAction<User>) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.isError = false;
      console.log(action.payload);
    },
    Failed: (state, action: PayloadAction<string | null>) => {
      state.isFetching = false;
      state.isError = true;
      state.error = action.payload;
    },
    //signup
    signUpSucces: (state, action: PayloadAction<User>) => {
      state.isFetching = false;
      state.isError = false;
      state.currentUser = action.payload;
    },
    signupFailed: (state, action: PayloadAction<string | null>) => {
      state.isFetching = false;
      state.error = action.payload;
    },
  },
});

export const {
  Start,
  loginSucces,
  Failed,
  logoutUser,
  signUpSucces,
  signupFailed,
  resetError,
  setAddress,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
