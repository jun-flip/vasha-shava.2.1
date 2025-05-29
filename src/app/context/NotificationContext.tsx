'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../../types';
import Image from 'next/image';

interface NotificationContextType {
  showNotification: (item: CartItem) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<CartItem | null>(null);

  const showNotification = (item: CartItem) => {
    setNotification(item);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const calculateTotalPrice = (item: CartItem) => {
    const additivesPrice = item.selectedAdditives?.reduce((sum, additive) => sum + additive.price, 0) || 0;
    return item.price + additivesPrice;
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-4 right-4 bg-white text-black px-4 py-3 rounded-lg shadow-lg z-50 min-w-[280px]"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={notification.image || '/default-food.png'}
                  alt={notification.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-black">{notification.name}</h4>
                {notification.selectedAdditives && notification.selectedAdditives.length > 0 && (
                  <p className="text-sm text-black mt-1">
                    {notification.selectedAdditives.map(additive => additive.name).join(', ')}
                  </p>
                )}
                <div className="mt-1">
                  <p className="text-sm text-black">
                    Товар: {notification.price} ₽
                  </p>
                  {notification.selectedAdditives && notification.selectedAdditives.length > 0 && (
                    <p className="text-sm text-black">
                      Добавки: {notification.selectedAdditives.reduce((sum, additive) => sum + additive.price, 0)} ₽
                    </p>
                  )}
                  <p className="text-sm font-medium text-black mt-1">
                    Итого: {calculateTotalPrice(notification)} ₽
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 