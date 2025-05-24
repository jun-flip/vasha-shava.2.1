'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity } = useCart();

  const handleCheckout = () => {
    onClose(); // Закрываем окно
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-20 left-4 right-4 md:right-4 md:w-96 max-w-md mx-auto bg-white rounded-lg shadow-xl z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Корзина</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Корзина пуста</p>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || '/default-food.png'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-medium truncate">{item.name}</h3>
                        {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                          <p className="text-sm text-gray-600 truncate">
                            {item.selectedAdditives.map(additive => additive.name).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="text-gray-500 hover:text-gray-700 px-2"
                          >
                            -
                          </button>
                          <span className="text-gray-900 mx-2">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="text-gray-500 hover:text-gray-700 px-2"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-900 font-medium">{item.price} ₽</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-semibold">Итого:</span>
                    <span className="text-gray-900 font-semibold">{total} ₽</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#6de082] text-white py-2 rounded-lg hover:bg-[#5bc06f] transition-colors"
                  >
                    Оформить
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 