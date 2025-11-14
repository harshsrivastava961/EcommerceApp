import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem, Product } from '../../utils/types';

interface CartState {
  items: CartItem[];
  currency: string;
}

const initialState: CartState = {
  items: [],
  currency: 'USD',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.product.id !== action.payload,
      );
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        cartItem => cartItem.product.id === action.payload,
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        cartItem => cartItem.product.id === action.payload,
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

