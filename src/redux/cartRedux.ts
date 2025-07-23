import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  quantity: number;
}

const initialState: CartState = {
  quantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state) => {
      state.quantity += 1;
    },
    deleteProduct: (state) => {
      state.quantity -= 1;
    },
    setProduct: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
  },
});

export const { addProduct, deleteProduct, setProduct } = cartSlice.actions;
export default cartSlice.reducer;
