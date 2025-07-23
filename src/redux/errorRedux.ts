import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

interface ErrorsState {
  error: string | null;
  id: string | null;
}

const initialState: ErrorsState = {
  error: null,
  id: null,
};

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.id = uuid();
    },
    clearError: (state) => {
      state.error = null;
      state.id = null;
    },
  },
});

export const { setError, clearError } = errorsSlice.actions;
export default errorsSlice.reducer;
