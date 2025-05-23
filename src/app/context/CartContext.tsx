'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Additive } from '../../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Ошибка при загрузке корзины:', error);
        }
      }
    }
  }, [isClient]);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isClient]);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Проверяем, есть ли уже такой товар с такими же добавками
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Если товар с такими же добавками уже есть, увеличиваем количество
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      
      // Если такого товара с такими добавками нет, добавляем новую позицию
      return [...prevItems, { ...newItem, quantity: 1 }];
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

  const total = items.reduce((sum, item) => {
    const itemTotal = item.price * (item.quantity || 1);
    const additivesTotal = (item.selectedAdditives || []).reduce(
      (additiveSum, additive) => additiveSum + additive.price * (item.quantity || 1),
      0
    );
    return sum + itemTotal + additivesTotal;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, clearCart }}>
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