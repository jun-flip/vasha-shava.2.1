'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { AddToCartAnimation } from './AddToCartAnimation';
import { Additive } from '../../types';

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isSpicy?: boolean;
    additives?: Additive[];
  };
}

const commonAdditives: Additive[] = [
  { id: 'additive-1', name: 'Сыр', price: 30 },
  { id: 'additive-2', name: 'Соус', price: 20 },
  { id: 'additive-3', name: 'Овощи', price: 25 },
  { id: 'additive-4', name: 'Грибы', price: 35 },
];

export function MenuItem({ item }: MenuItemProps) {
  const { addItem } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAdditives, setSelectedAdditives] = useState<Additive[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showAddToCartAnimation, setShowAddToCartAnimation] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      selectedAdditives,
    });

    setSelectedAdditives([]);
    setIsExpanded(false);
    setShowAddToCartAnimation(true);
    setTimeout(() => setShowAddToCartAnimation(false), 2000);
  };

  const toggleAdditive = (additive: Additive) => {
    setSelectedAdditives((prev) =>
      prev.some((a) => a.id === additive.id)
        ? prev.filter((a) => a.id !== additive.id)
        : [...prev, additive]
    );
  };

  const totalPrice =
    item.price +
    selectedAdditives.reduce((sum, additive) => sum + additive.price, 0);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="relative h-48">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            onLoadingComplete={() => setIsImageLoading(false)}
          />
          {item.isSpicy && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              Острое
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{item.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">{item.price} ₽</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#6de082] hover:text-[#5bc06f] transition-colors"
            >
              {isExpanded ? 'Скрыть' : 'Добавить'}
            </motion.button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {commonAdditives.map((additive) => (
                      <button
                        key={additive.id}
                        onClick={() => toggleAdditive(additive)}
                        className={`p-2 rounded-md text-sm transition-colors ${
                          selectedAdditives.some((a) => a.id === additive.id)
                            ? 'bg-[#6de082] text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {additive.name} (+{additive.price} ₽)
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Итого:</span>
                    <span className="text-lg font-bold">{totalPrice} ₽</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-[#6de082] text-white rounded-md hover:bg-[#5bc06f] transition-colors"
                  >
                    Добавить в корзину
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AddToCartAnimation
        item={item}
        isVisible={showAddToCartAnimation}
      />
    </>
  );
} 