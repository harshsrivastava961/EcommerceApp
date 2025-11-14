import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fakestoreApi } from '../../services/api';
import type { Product, ProductCategory, SortOption } from '../../utils/types';

interface FetchProductsPayload {
  category?: ProductCategory;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category }: FetchProductsPayload = {}) => {
    const url =
      category && category !== 'all'
        ? `/products/category/${encodeURIComponent(category)}`
        : '/products';
    const response = await fakestoreApi.get<Product[]>(url);
    return response.data;
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await fakestoreApi.get<ProductCategory[]>(
      '/products/categories',
    );
    return response.data;
  },
);

interface ProductState {
  products: Product[];
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  sortOption: SortOption;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: ['all'],
  selectedCategory: 'all',
  searchQuery: '',
  sortOption: 'popularity',
  loading: false,
  error: null,
};

const sortProducts = (products: Product[], sortOption: SortOption) => {
  switch (sortOption) {
    case 'price_low_high':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price_high_low':
      return [...products].sort((a, b) => b.price - a.price);
    default:
      return products;
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<ProductCategory>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
      state.products = sortProducts(state.products, action.payload);
    },
    clearProducts: state => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = sortProducts(action.payload, state.sortOption);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = ['all', ...action.payload];
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setSortOption,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;

