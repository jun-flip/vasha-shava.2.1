export type Category = 'all' | 'spicy' | 'vegetarian' | 'drinks';

export interface Additive {
  id: number;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  isSpicy?: boolean;
  quantity?: number;
  additives?: Additive[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  selectedAdditives?: Additive[];
} 