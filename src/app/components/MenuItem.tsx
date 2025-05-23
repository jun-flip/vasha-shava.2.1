'use client';

import { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '../../types';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdditivesOpen, setIsAdditivesOpen] = useState(false);
  const [selectedAdditives, setSelectedAdditives] = useState<number[]>([]);

  // Отключаем hover эффекты при открытом попапе
  useEffect(() => {
    if (isAdditivesOpen) {
      setIsHovered(false);
    }
  }, [isAdditivesOpen]);

  const handleAddToCart = () => {
    const selectedAdditivesList = item.additives?.filter(additive => 
      selectedAdditives.includes(additive.id)
    ) || [];

    // Создаем уникальный ID для товара в корзине, учитывая добавки
    const additivesString = selectedAdditivesList.length > 0 
      ? `-${selectedAdditivesList.map(a => a.id).sort().join('-')}`
      : '';

    addItem({
      id: `${item.id}${additivesString}`,
      name: item.name,
      price: item.price,
      image: item.image,
      selectedAdditives: selectedAdditivesList
    });
  };

  const toggleAdditive = (additiveId: number) => {
    setSelectedAdditives(prev => 
      prev.includes(additiveId)
        ? prev.filter(id => id !== additiveId)
        : [...prev, additiveId]
    );
  };

  const totalPrice = item.price + (item.additives?.reduce((sum, additive) => 
    selectedAdditives.includes(additive.id) ? sum + additive.price : sum, 0) || 0);

  return (
    <div 
      className={`bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 ${
        !isAdditivesOpen && 'hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
      }`}
      onMouseEnter={() => !isAdditivesOpen && setIsHovered(true)}
      onMouseLeave={() => !isAdditivesOpen && setIsHovered(false)}
    >
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
        {item.isSpicy && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            Острое
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        
        {item.category !== 'drinks' && item.additives && (
          <div className="mt-4">
            <button
              onClick={() => setIsAdditivesOpen(true)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300 p-2 rounded-lg"
            >
              <span>Добавки</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#6de082]">{totalPrice} ₽</span>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-md text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
              isHovered && !isAdditivesOpen ? 'bg-[#5bc06f]' : 'bg-[#6de082]'
            }`}
          >
            В корзину
          </button>
        </div>
      </div>

      {/* Additives Popup */}
      <AnimatePresence mode="wait">
        {isAdditivesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={() => setIsAdditivesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring",
                duration: 0.3,
                bounce: 0.2
              }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Добавки</h3>
                <button
                  onClick={() => setIsAdditivesOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {item.additives?.map((additive) => (
                  <label
                    key={additive.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAdditives.includes(additive.id)}
                        onChange={() => toggleAdditive(additive.id)}
                        className="w-4 h-4 text-[#6de082] border-gray-300 rounded focus:ring-[#6de082]"
                      />
                      <span className="ml-3 text-gray-700">{additive.name}</span>
                    </div>
                    <span className="text-gray-600">+{additive.price} ₽</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Итого с добавками:</span>
                <span className="text-xl font-bold text-[#6de082]">{totalPrice} ₽</span>
              </div>
              <button
                onClick={() => setIsAdditivesOpen(false)}
                className="mt-4 w-full bg-[#6de082] text-white py-2 px-4 rounded-md hover:bg-[#5bc06f] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Готово
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 