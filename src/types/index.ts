export type Category = 'all' | 'spicy' | 'vegetarian' | 'drinks' | 'combo' | 'new';

export interface Additive {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  isSpicy?: boolean;
  quantity?: number;
  additives?: Additive[];
  rating?: number;
  reviews?: Review[];
  isNew?: boolean;
  isPopular?: boolean;
  calories?: number;
  allergens?: string[];
  preparationTime?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  selectedAdditives?: Additive[];
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  favoriteItems?: string[];
  orderHistory?: Order[];
  loyaltyPoints?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'delivery' | 'pickup';
  address?: string;
  phone: string;
  notes?: string;
  createdAt: string;
  estimatedTime?: string;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'paid';
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  items: MenuItem[];
  discount: number;
  isPopular?: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrderAmount?: number;
  validUntil: string;
  isActive: boolean;
} 