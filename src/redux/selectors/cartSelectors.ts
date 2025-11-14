import { createSelector } from '@reduxjs/toolkit';

import { TAX_RATE } from '../../utils/constants';
import type { RootState } from '../store';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCurrency = (state: RootState) => state.cart.currency;

export const selectCartSubtotal = createSelector(selectCartItems, items =>
  items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ),
);

export const selectCartTax = createSelector(selectCartSubtotal, subtotal =>
  subtotal * TAX_RATE,
);

export const selectCartTotal = createSelector(
  selectCartSubtotal,
  selectCartTax,
  (subtotal, tax) => subtotal + tax,
);

