'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import OrderConfirmationModal from './OrderConfirmationModal';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreorder = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Корзина</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Корзина пуста</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
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
            ))}
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Итого:</span>
              <span className="text-xl font-bold text-[#6de082]">{total} ₽</span>
            </div>
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