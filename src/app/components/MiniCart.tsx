'use client';

import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function MiniCart() {
  const { items, removeItem, total } = useCart();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-white hover:text-[#6de082] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {items.length > 0 && (
          <span className="font-medium">{items.length}</span>
        )}
      </button>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 hidden group-hover:block"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Корзина</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.price} ₽</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Итого:</span>
                  <span className="text-lg font-semibold text-gray-900">{total} ₽</span>
                </div>
                <Link
                  href="/cart"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6de082] hover:bg-[#5bc06f]"
                >
                  Оформить заказ
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 