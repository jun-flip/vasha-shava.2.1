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
  cartUpdateSignal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartUpdateSignal, setCartUpdateSignal] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      console.log('CartContext: загружаем корзину из localStorage:', savedCart);
      if (savedCart) {
        try {
          const parsedItems = JSON.parse(savedCart);
          console.log('CartContext: парсим корзину:', parsedItems);
          setItems(parsedItems);
          console.log('CartContext: корзина загружена:', parsedItems);
        } catch (error) {
          console.error('Ошибка при загрузке корзины:', error);
          localStorage.removeItem('cart'); // Очищаем некорректные данные
        }
      } else {
        console.log('CartContext: корзина в localStorage не найдена');
      }
      setIsInitialized(true);
    }
  }, []);

  // Сохранение корзины в localStorage при изменении, но только после инициализации
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      console.log('CartContext: useEffect для сохранения корзины вызван');
      console.log('CartContext: isInitialized:', isInitialized);
      console.log('CartContext: items для сохранения:', items);
      console.log('CartContext: items.length:', items.length);
      console.log('CartContext: сохраняем корзину в localStorage:', items);
      localStorage.setItem('cart', JSON.stringify(items));
      console.log('CartContext: корзина сохранена в localStorage');
    } else {
      console.log('CartContext: useEffect для сохранения корзины пропущен');
      console.log('CartContext: typeof window !== undefined:', typeof window !== 'undefined');
      console.log('CartContext: isInitialized:', isInitialized);
    }
  }, [items, isInitialized]);

  const addItem = (newItem: CartItem) => {
    console.log('CartContext: addItem вызвана с:', newItem);
    console.log('CartContext: текущее состояние items перед addItem:', items);
    setItems(prevItems => {
      console.log('CartContext: текущие товары в корзине:', prevItems);
      // Проверяем, есть ли уже такой товар с такими же добавками
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Если товар с такими же добавками уже есть, увеличиваем количество
        console.log('CartContext: товар уже существует, увеличиваем количество');
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      
      // Если такого товара с такими добавками нет, добавляем новую позицию
      console.log('CartContext: добавляем новый товар');
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
    setCartUpdateSignal(prev => prev + 1);
  };

  const removeItem = (id: string) => {
    console.log('CartContext: removeItem вызвана для id:', id);
    console.log('CartContext: текущее состояние items перед removeItem:', items);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('CartContext: updateQuantity вызвана для id:', id, 'quantity:', quantity);
    console.log('CartContext: текущее состояние items перед updateQuantity:', items);
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
    console.log('CartContext: clearCart вызвана');
    console.log('CartContext: stack trace:', new Error().stack);
    console.log('CartContext: текущее состояние items перед clearCart:', items);
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

  // Расчет общего количества товаров
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, clearCart, cartUpdateSignal, totalItems }}>
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