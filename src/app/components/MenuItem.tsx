'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
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

export function MenuItem({ item }: MenuItemProps) {
  const { addItem } = useCart();
  const [showAddToCartAnimation, setShowAddToCartAnimation] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      selectedAdditives: [],
    });
    setShowAddToCartAnimation(true);
    setTimeout(() => setShowAddToCartAnimation(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      className="relative bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col border-4 border-[#222] hover:border-[#6de082] transition-all duration-200 group"
    >
      <div className="relative w-full h-56 sm:h-64 md:h-56 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.isSpicy && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg tracking-widest rotate-[-8deg] border-2 border-white">
            ОСТРОЕ
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
            {item.name}
          </h3>
          <p className="text-gray-300 text-base font-medium mb-4 line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <span className="text-2xl font-black text-[#6de082] drop-shadow-lg">
            {item.price} ₽
          </span>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAddToCart}
            className="bg-[#6de082] text-black font-extrabold px-6 py-2 rounded-full shadow-md border-2 border-black hover:bg-black hover:text-[#6de082] hover:border-[#6de082] transition-colors duration-200 text-lg tracking-wider uppercase"
          >
            В корзину
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {showAddToCartAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-6 py-3 rounded-2xl shadow-2xl border-2 border-[#6de082] z-50 text-lg"
          >
            Добавлено!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 