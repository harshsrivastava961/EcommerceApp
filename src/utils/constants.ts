export const COLORS = {
  primary: '#2A9D8F',
  background: '#FFFFFF',
  text: '#1F1F1F',
  muted: '#8A8A8E',
  border: '#E0E0E0',
  success: '#2ECC71',
  danger: '#E74C3C',
} as const;

export const TAX_RATE = 0.08; // 8% demo tax

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
  { label: 'Popularity', value: 'popularity' },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  electronics: 'Electronics',
  jewelery: 'Jewelry',
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
};

