export type ProductCategory =
  | 'electronics'
  | 'jewelery'
  | "men's clothing"
  | "women's clothing"
  | 'all';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  createdAt: string;
  paymentIntentId?: string;
}

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export type SortOption = 'price_low_high' | 'price_high_low' | 'popularity';

