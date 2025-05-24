'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem & { quantity?: number; selectedAdditives?: any[] }) => void;
  removeFromCart: (itemId: number, selectedAdditives?: any[]) => void;
  updateQuantity: (itemId: number, quantity: number, selectedAdditives?: any[]) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
  }
  return [];
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (item: MenuItem & { quantity?: number; selectedAdditives?: any[] }) => {
    setItems(currentItems => {
      // Функция сравнения добавок по id
      const additivesIds = (adds?: any[]) => (adds ? adds.map(a => a.id).sort().join(',') : '');
      const itemAdditives = additivesIds(item.selectedAdditives);
      // Ищем существующий товар с тем же id и тем же набором добавок
      const existingItem = currentItems.find(i => i.id === item.id && additivesIds(i.selectedAdditives) === itemAdditives);
      const addQty = item.quantity ?? 1;
      if (existingItem) {
        return currentItems.map(i =>
          i === existingItem ? { ...i, quantity: i.quantity + addQty } : i
        );
      }
      return [...currentItems, { ...item, quantity: addQty }];
    });
  };

  const removeFromCart = (itemId: number, selectedAdditives?: any[]) => {
    const additivesIds = (adds?: any[]) => (adds ? adds.map(a => a.id).sort().join(',') : '');
    setItems(currentItems => currentItems.filter(item => {
      if (item.id !== itemId) return true;
      if (!selectedAdditives) return false;
      return additivesIds(item.selectedAdditives) !== additivesIds(selectedAdditives);
    }));
  };

  const updateQuantity = (itemId: number, quantity: number, selectedAdditives?: any[]) => {
    const additivesIds = (adds?: any[]) => (adds ? adds.map(a => a.id).sort().join(',') : '');
    if (quantity < 1) {
      removeFromCart(itemId, selectedAdditives);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId && additivesIds(item.selectedAdditives) === additivesIds(selectedAdditives)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 