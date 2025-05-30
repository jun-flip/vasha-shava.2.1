'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { useNotification } from '../context/NotificationContext';
import { useCartDropdown } from '../context/CartDropdownContext';
import { useClickSound } from '../hooks/useClickSound';
import SoundButton from './SoundButton';

export default function CartDropdown() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, addItem } = useCart();
  const { showNotification } = useNotification();
  const { isOpen, closeCart } = useCartDropdown();
  const handleClick = useClickSound();
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

  // Получение рекомендуемых добавок для товара
  const getRecommendedAdditives = (itemId: string) => {
    const baseItemId = itemId.split('-')[0];
    const menuItem = menuItems.find(mi => mi.id.toString() === baseItemId);
    
    if (!menuItem?.additives) return null;

    const item = items.find(i => i.id === itemId);
    if (!item) return null;

    // Получаем все доступные добавки для этого блюда
    const availableAdditives = menuItem.additives || [];
    
    // Фильтруем добавки, которые еще не выбраны
    const unselectedAdditives = availableAdditives.filter(additive => 
      !item.selectedAdditives?.some(selected => selected.id === additive.id)
    );

    // Возвращаем до 3 случайных добавок из невыбранных
    return unselectedAdditives
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  const handleAddAdditive = (itemId: string, additive: any) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Проверяем, не добавлена ли уже эта добавка
    if (item.selectedAdditives?.some(a => a.id === additive.id)) return;

    const updatedItem = {
      ...item,
      selectedAdditives: [...(item.selectedAdditives || []), additive],
      price: item.price + additive.price
    };

    // Обновляем товар на месте, сохраняя его позицию
    const updatedItems = items.map(i => 
      i.id === itemId ? updatedItem : i
    );
    
    // Обновляем корзину с новым списком товаров
    items.forEach(i => removeItem(i.id));
    updatedItems.forEach(i => addItem(i));
    
    showNotification(updatedItem);
  };

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
            onClick={handleClick(closeCart)}
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
                onClick={handleClick(closeCart)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </SoundButton>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
                <p className="text-gray-500 text-center">Корзина пуста</p>
            ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const recommendedAdditives = getRecommendedAdditives(item.id);
                    return (
                      <div key={item.id} className="flex items-center space-x-4">
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
                          {recommendedAdditives && recommendedAdditives.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-900 font-medium">К заказу отлично подойдет:</p>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {recommendedAdditives.map(additive => (
                                  <SoundButton
                                    key={additive.id}
                                    onClick={() => handleAddAdditive(item.id, additive)}
                                    className="bg-[#8fc52f] px-1.5 py-0.5 rounded-full text-xs text-white hover:bg-[#7db02a] transition-colors"
                                  >
                                    {additive.name} +{additive.price}₽
                                  </SoundButton>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-2">
                          <SoundButton
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                className="px-2 py-1 border rounded text-gray-700 hover:bg-[#8fc52f] hover:text-white transition-colors"
                          >
                            -
                          </SoundButton>
                              <span className="text-sm text-gray-900">{item.quantity || 1}</span>
                          <SoundButton
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="px-2 py-1 border rounded text-gray-700 hover:bg-[#8fc52f] hover:text-white transition-colors"
                          >
                            +
                          </SoundButton>
                        </div>
                        <SoundButton
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </SoundButton>
                      </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.price * (item.quantity || 1)} ₽
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {recommendedDrinks.length > 0 && showRecommendations && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">К заказу отлично подойдет</h4>
                  <SoundButton
                    onClick={() => setShowRecommendations(false)}
                    className="text-gray-500 hover:text-gray-700"
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
                    const deliveryCost = subtotal > 0 && subtotal < 1000 ? 200 : 0;
                    return `${subtotal + deliveryCost} ₽`;
                  })()}
                </span>
              </div>
              {items.length === 0 ? (
                <div className="text-sm text-gray-500 mb-4">
                  Ваша корзина пуста
                </div>
              ) : items.reduce((total, item) => total + item.price * (item.quantity || 1), 0) < 1000 && (
                <div className="text-sm text-gray-500 mb-4">
                  * Доставка 200₽ включена в сумму
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