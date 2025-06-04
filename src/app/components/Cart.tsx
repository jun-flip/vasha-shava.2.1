'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import OrderConfirmationModal from './OrderConfirmationModal';
import { MenuItem } from '../../types';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedDrinks, setRecommendedDrinks] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Загрузка всех товаров меню
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items...');
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        console.log('Menu items loaded:', data);
        setMenuItems(data);
      } catch (error) {
        console.error('Ошибка при загрузке меню:', error);
      }
    };
    fetchMenuItems();
  }, []);

  // Определение рекомендуемых напитков
  useEffect(() => {
    console.log('Checking for drinks recommendations...');
    console.log('Current items:', items);
    console.log('Menu items:', menuItems);

    if (menuItems.length === 0) {
      console.log('No menu items available');
      return;
    }

    const hasDrinks = items.some(item => {
      const menuItem = menuItems.find(mi => mi.id.toString() === item.id.split('-')[0]);
      console.log('Checking item:', item.id, 'Menu item:', menuItem);
      return menuItem?.category === 'drinks';
    });

    console.log('Has drinks in cart:', hasDrinks);

    if (!hasDrinks) {
      const drinks = menuItems
        .filter(item => item.category === 'drinks')
        .slice(0, 3);
      console.log('Setting recommended drinks:', drinks);
      setRecommendedDrinks(drinks);
    } else {
      console.log('No drinks recommendations needed');
      setRecommendedDrinks([]);
    }
  }, [items, menuItems]);

  const handlePreorder = () => {
    setIsModalOpen(true);
  };

  // Получение рекомендуемых добавок для товара
  const getRecommendedAdditives = (itemId: string) => {
    const baseItemId = itemId.split('-')[0];
    const menuItem = menuItems.find(mi => mi.id.toString() === baseItemId);
    
    console.log('Getting additives for item:', itemId);
    console.log('Base item ID:', baseItemId);
    console.log('Found menu item:', menuItem);
    
    if (!menuItem?.additives) {
      console.log('No additives available for this item');
      return null;
    }

    const item = items.find(i => i.id === itemId);
    console.log('Current item in cart:', item);
    
    if (!item || !item.selectedAdditives || item.selectedAdditives.length === 0) {
      const recommended = menuItem.additives.slice(0, 3);
      console.log('Recommending additives:', recommended);
      return recommended;
    }
    
    console.log('Item already has additives, no recommendations needed');
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Корзина</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Корзина пуста</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const recommendedAdditives = getRecommendedAdditives(item.id);
              return (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.price} ₽</p>
                  {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                    <div className="mt-1 text-sm text-gray-500">
                      {item.selectedAdditives.map(additive => (
                        <div key={additive.id} className="flex justify-between">
                          <span>{additive.name}</span>
                          <span>+{additive.price} ₽</span>
                        </div>
                      ))}
                    </div>
                  )}
                    {recommendedAdditives && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="text-[#6de082] font-medium">Рекомендуемые добавки:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {recommendedAdditives.map(additive => (
                            <span key={additive.id} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                              {additive.name} +{additive.price}₽
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity ?? 1) - 1))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span className="text-gray-900">{item.quantity ?? 1}</span>
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
              );
            })}
          </div>

          {/* Рекомендуемые напитки */}
          {recommendedDrinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Рекомендуем к заказу:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedDrinks.map(drink => (
                  <div key={drink.id} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={drink.image}
                        alt={drink.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{drink.name}</h4>
                      <p className="text-sm text-[#6de082]">{drink.price} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Итого:</span>
              <span className="text-xl font-bold text-[#6de082]">
                {(() => {
                  const subtotal = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
                  const deliveryCost = subtotal > 0 && subtotal < 500 ? 150 : 0;
                  return `${subtotal + deliveryCost} ₽`;
                })()}
              </span>
            </div>
            {items.length > 0 && items.reduce((total, item) => total + item.price * (item.quantity || 1), 0) < 500 && (
              <div className="text-sm text-gray-500 mt-2">
                * Доставка 150₽ включена в сумму
              </div>
            )}
            <button 
              onClick={handlePreorder}
              className="mt-4 w-full bg-[#6de082] text-white py-2 px-4 rounded-md hover:bg-[#5bc06f] transition-colors"
            >
              Заказать
            </button>
          </div>
        </>
      )}
      <OrderConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={total}
      />
    </div>
  );
} 