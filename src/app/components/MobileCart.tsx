'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

interface MobileCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileCart({ isOpen, onClose }: MobileCartProps) {
  const { items, removeItem, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Корзина</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Корзина пуста
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.selectedAdditives?.map((a) => a.name).join(', ')}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium">{item.price} ₽</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Итого:</span>
                    <span className="text-xl font-bold">{total} ₽</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#6de082] text-white rounded-md hover:bg-[#5bc06f] transition-colors"
                  >
                    Оформить заказ
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 