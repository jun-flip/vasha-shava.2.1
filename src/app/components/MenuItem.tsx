'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem as MenuItemType, Additive } from '@/types';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const additiveIcons: Record<string, string> = {
  'Больше мяса': '🥩',
  'Больше фалафеля': '🧆',
  'Сыр': '🧀',
  'Овощи': '🥗',
  'Фирменный соус': '🫙',
};

interface MenuItemProps {
  item: MenuItemType;
}

function AdditivesSelector({ additives, selected, onChange }: { additives: Additive[]; selected: string[]; onChange: (id: string) => void }) {
  return (
    <div className="space-y-2 mt-4 w-full">
      <div className="font-semibold mb-2 text-gray-800">Добавки:</div>
      {additives.map(add => (
        <label key={add.id} className="flex items-center gap-2 text-sm cursor-pointer text-black">
          <input
            type="checkbox"
            checked={selected.includes(add.id)}
            onChange={() => onChange(add.id)}
            className="accent-[#6de082] w-4 h-4"
          />
          <span className="flex items-center gap-1 text-black">
            <span>{additiveIcons[add.name] || '➕'}</span>
            <span>{add.name}</span>
            <span className="text-gray-400">+{add.price}₽</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);

  const handleAdditiveChange = (id: string) => {
    setSelectedAdditives((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      quantity: 1,
      selectedAdditives: [],
    });
  };

  const handleModalAddToCart = () => {
    addToCart({
      ...item,
      quantity,
      selectedAdditives: item.additives?.filter(a => selectedAdditives.includes(a.id)) || [],
    });
    setShowModal(false);
    setQuantity(1);
    setSelectedAdditives([]);
  };

  return (
    <>
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col h-full min-h-[370px] md:min-h-[420px]"
    >
        <div
          className="relative h-40 md:h-48 w-full overflow-hidden cursor-pointer"
          onClick={() => setShowModal(true)}
        >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.isSpicy && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
            Острое 🌶️
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div
          className="flex justify-between items-start mb-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-grow line-clamp-1">{item.name}</h3>
          <span className="text-xl md:text-2xl font-bold text-[#6de082] ml-2">{item.price} ₽</span>
        </div>
        <p className="text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">{item.description}</p>
        <button
          onClick={handleAddToCart}
          className="mt-auto w-full bg-[#6de082] hover:bg-[#5bc070] text-white font-bold py-2 md:py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm md:text-base"
        >
          Добавить
        </button>
      </div>
    </motion.div>

    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-start md:justify-center bg-[#5f2dab]/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="popup-content bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 mt-8 md:mt-0 relative text-left"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-start">
              <div className="relative h-40 md:h-48 w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={`object-cover transition-transform duration-300 scale-100 rounded-t-2xl`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {item.isSpicy && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                    Острое 🌶️
                  </div>
                )}
              </div>
              <div className="p-4 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                {item.additives && item.additives.length > 0 && (
                  <AdditivesSelector additives={item.additives} selected={selectedAdditives} onChange={handleAdditiveChange} />
                )}
                <div className="flex items-center gap-4 mt-6 mb-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl"
                  >-</button>
                  <span className="text-lg font-bold w-8 text-center text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl"
                  >+</button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleModalAddToCart}
                  className="w-full bg-[#6de082] hover:bg-[#5bc070] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg mt-2"
                >
                  Добавить в корзину
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
} 