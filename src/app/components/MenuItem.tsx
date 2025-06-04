'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem as MenuItemType, CartItem, Additive } from '../../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAdditives, setSelectedAdditives] = useState<Additive[]>([]);
  const [isAdditivesOpen, setIsAdditivesOpen] = useState(false);
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = () => {
    setIsAdding(true);
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      selectedAdditives: selectedAdditives
    };
    addItem(cartItem);
    showNotification(cartItem);
    setSelectedAdditives([]);
    
    // Воспроизводим звук
    const audio = new Audio('/sounds/bubbles4.mp3');
    audio.play().catch(error => console.log('Ошибка воспроизведения звука:', error));
    setTimeout(() => setIsAdding(false), 500);
  };

  const toggleAdditive = (additive: Additive) => {
    setSelectedAdditives(prev => {
      const isSelected = prev.some(a => a.id === additive.id);
      if (isSelected) {
        return prev.filter(a => a.id !== additive.id);
      } else {
        return [...prev, additive];
      }
    });
  };

  const calculateTotalPrice = () => {
    const additivesPrice = selectedAdditives.reduce((sum, additive) => sum + additive.price, 0);
    return item.price + additivesPrice;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full h-48 mb-3">
        <Image
          src={item.image}
          alt={item.name}
          fill
            className="object-cover rounded-t-lg"
        />
        {item.isSpicy && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            Острое
          </div>
        )}
      </div>
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">{item.name}</h3>
          <p className="mt-2 text-sm text-gray-600 font-medium">{item.description}</p>
          <div className="mt-3 text-lg font-bold text-[#8fc52f]">{item.price} ₽</div>
          <div className="mt-4 space-y-2">
            {item.additives && item.additives.length > 0 && (
            <button
              onClick={() => setIsAdditivesOpen(true)}
                className="w-full text-sm font-medium text-white bg-gray-500 rounded-lg py-2"
            >
                Добавки
            </button>
        )}
          <button
            onClick={handleAddToCart}
              className="w-full py-2 bg-[#8fc52f] text-white rounded-lg font-semibold hover:bg-[#7db02a] transition-colors"
          >
            В корзину
          </button>
        </div>
      </div>
      </div>
      </motion.div>

      {/* Попап с добавками */}
      <AnimatePresence>
        {isAdditivesOpen && (
          <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsAdditivesOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-[64px] left-[calc(50%-140px)] sm:left-[calc(50%-175px)] md:left-[calc(50%-250px)] w-[280px] sm:w-[350px] md:w-[500px] h-[80vh] bg-white rounded-lg shadow-xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Добавки</h3>
                <button
                  onClick={() => setIsAdditivesOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {item.additives?.map(additive => (
                    <button
                    key={additive.id}
                      onClick={() => toggleAdditive(additive)}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                        selectedAdditives.some(a => a.id === additive.id)
                          ? 'bg-[#8fc52f] text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{additive.name}</span>
                        <span>+{additive.price} ₽</span>
                    </div>
                    </button>
                ))}
                </div>
              </div>
              <div className="p-4 border-t bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-900 font-medium">Итого:</span>
                  <span className="text-gray-900 font-medium">{calculateTotalPrice()} ₽</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleAddToCart();
                    setIsAdditivesOpen(false);
                    setSelectedAdditives([]);
                  }}
                  className="w-full bg-[#8fc52f] text-white py-2 rounded-lg hover:bg-[#7db02a] transition-colors"
                >
                  В корзину
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 