'use client';

import { useState } from 'react';
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
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);

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

  const toggleAdditive = (additiveId: string) => {
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
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              onClick={() => setIsAdditivesOpen(!isAdditivesOpen)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>Добавки</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isAdditivesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isAdditivesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {item.additives.map((additive) => (
                      <label
                        key={additive.id}
                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAdditives.includes(additive.id)}
                            onChange={() => toggleAdditive(additive.id)}
                            className="mr-2"
                          />
                          <span className="text-gray-700">{additive.name}</span>
                        </div>
                        <span className="text-gray-600">+{additive.price} ₽</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#6de082]">{totalPrice} ₽</span>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 ${
              isHovered ? 'bg-[#5bc06f]' : 'bg-[#6de082]'
            }`}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
} 