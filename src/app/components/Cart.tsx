'use client';

import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export function Cart() {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <div className="bg-[#232323] rounded-2xl p-8 shadow-xl border-2 border-[#6de082]">
      <h2 className="text-3xl font-extrabold text-white mb-6 graffiti-title">Корзина</h2>
      {items.length === 0 ? (
        <p className="text-gray-300">Ваша корзина пуста.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-between items-center bg-black p-4 rounded-lg"
            >
              <span className="text-white font-bold">{item.name}</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.id, (item.quantity || 0) - 1)}
                  className="text-[#6de082] hover:text-white transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-white font-bold">{item.quantity || 0}</span>
                <button
                  onClick={() => updateQuantity(item.id, (item.quantity || 0) + 1)}
                  className="text-[#6de082] hover:text-white transition-colors duration-200"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Удалить
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
} 