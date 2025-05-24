export type Category = 'all' | 'spicy' | 'vegetarian' | 'drinks';

export interface Additive {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: Category;
  isSpicy?: boolean;
  quantity?: number;
  additives?: Additive[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedAdditives?: Additive[];
}

export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
} 