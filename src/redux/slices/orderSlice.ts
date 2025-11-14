import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { CartItem, Order } from '../../utils/types';
import { firestore } from '../../services/firebase';

interface PlaceOrderArgs {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentIntentId?: string;
}

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData: PlaceOrderArgs, { rejectWithValue }) => {
    try {
      console.log('Creating order in Firestore:', orderData);
      const docRef = await addDoc(collection(firestore, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
      });
      console.log('Order created in Firestore with ID:', docRef.id);
      return {
        id: docRef.id,
        ...orderData,
        createdAt: new Date().toISOString(),
      } satisfies Order;
    } catch (error: any) {
      console.error('Error creating order in Firestore:', error);
      const errorMessage =
        error?.message || error?.code || 'Failed to create order';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const ordersQuery = query(
        collection(firestore, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );
      const snapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];
      snapshot.forEach(doc =>
        orders.push({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>),
          createdAt:
            (doc.data()?.createdAt?.toDate?.()?.toISOString?.() as
              | string
              | undefined) ?? new Date().toISOString(),
        }),
      );
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: state => {
      state.orders = [];
      state.error = null;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrders, setOrders } = orderSlice.actions;

export default orderSlice.reducer;

