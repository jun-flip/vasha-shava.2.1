'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Additive } from '../../types';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  selectedAdditives?: Additive[];
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isClient]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Проверяем, есть ли уже такой товар с такими же добавками
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Если товар с такими же добавками уже есть, увеличиваем количество
        return prevItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      
      // Если такого товара с такими добавками нет, добавляем новую позицию
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => {
    const itemTotal = item.price * (item.quantity || 1);
    const additivesTotal = (item.selectedAdditives || []).reduce(
      (additiveSum, additive) => additiveSum + additive.price * (item.quantity || 1),
      0
    );
    return sum + itemTotal + additivesTotal;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
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