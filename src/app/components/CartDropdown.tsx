'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { useNotification } from '../context/NotificationContext';
import { useCartDropdown } from '../context/CartDropdownContext';
import SoundButton from './SoundButton';

const isVercel = !!process.env.VERCEL;

export default function CartDropdown() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, addItem } = useCart();
  const { showNotification } = useNotification();
  const { isOpen, closeCart } = useCartDropdown();
  const [recommendedDrinks, setRecommendedDrinks] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Загрузка всех товаров меню
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Ошибка при загрузке меню:', error);
      }
    };
    fetchMenuItems();
  }, []);

  // Определение рекомендуемых напитков
  useEffect(() => {
    if (menuItems.length === 0) return;

    const hasDrinks = items.some(item => {
      const menuItem = menuItems.find(mi => mi.id.toString() === item.id.split('-')[0]);
      return menuItem?.category === 'drinks';
    });

    if (!hasDrinks) {
      const drinks = menuItems
        .filter(item => item.category === 'drinks')
        .slice(0, 3);
      setRecommendedDrinks(drinks);
    } else {
      setRecommendedDrinks([]);
    }
  }, [items, menuItems]);

  const handleAddDrink = (drink: MenuItem) => {
    const cartItem = {
      id: `${drink.id}-${Date.now()}`,
      name: drink.name,
      price: drink.price,
      image: drink.image,
      quantity: 1,
      selectedAdditives: []
    };
    addItem(cartItem);
    showNotification(cartItem);
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-[64px] left-[calc(50%-140px)] sm:left-[calc(50%-175px)] md:left-[calc(50%-250px)] w-[280px] sm:w-[350px] md:w-[500px] h-[80vh] bg-white rounded-lg shadow-xl z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Корзина</h3>
              <SoundButton
                onClick={closeCart}
                className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
              >
                ✕
              </SoundButton>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Корзина пуста
                </div>
            ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Добавки: {item.selectedAdditives.map(a => a.name).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <SoundButton
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              -
                            </SoundButton>
                            <span className="text-sm text-gray-900">{item.quantity || 1}</span>
                            <SoundButton
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </SoundButton>
                          </div>
                          <SoundButton
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent"
                          >
                            ✕
                          </SoundButton>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.price * (item.quantity || 1)} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
                  </div>
            {recommendedDrinks.length > 0 && showRecommendations && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">К заказу отлично подойдет</h4>
                  <SoundButton
                    onClick={() => setShowRecommendations(false)}
                    className="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
                  >
                    ✕
                  </SoundButton>
                </div>
                <div className="space-y-2">
                  {recommendedDrinks.map((drink) => (
                    <div key={drink.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={drink.image}
                          alt={drink.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{drink.name}</h5>
                        <p className="text-xs text-gray-500">{drink.price} ₽</p>
                      </div>
                      <SoundButton
                        onClick={() => handleAddDrink(drink)}
                        className="px-3 py-1 bg-[#8fc52f] text-white text-sm rounded-lg hover:bg-[#7db02a] transition-colors"
                      >
                        Добавить
                      </SoundButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-900 font-medium">Итого:</span>
                <span className="text-gray-900 font-medium">
                  {(() => {
                    const subtotal = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
                    const deliveryCost = subtotal > 0 && subtotal < 500 ? 150 : 0;
                    return `${subtotal + deliveryCost} ₽`;
                  })()}
                </span>
              </div>
              {items.length === 0 ? (
                <div className="text-sm text-gray-500 mb-4">
                  Ваша корзина пуста
                </div>
              ) : items.reduce((total, item) => total + item.price * (item.quantity || 1), 0) < 500 && (
                <div className="text-sm text-gray-500 mb-4">
                  * Доставка 150₽ включена в сумму
                </div>
              )}
              <SoundButton
                onClick={handleCheckout}
                disabled={items.length === 0}
                className={`w-full py-3 rounded-lg text-white transition-colors ${
                  items.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#8fc52f] hover:bg-[#7db02a]'
                }`}
              >
                Оформить заказ
              </SoundButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 