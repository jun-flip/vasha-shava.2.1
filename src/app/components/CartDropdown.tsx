'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePreorder = () => {
    router.push('/preorder');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#6de082] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-[9999]">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Корзина</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Корзина пуста</p>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.price} ₽</p>
                        {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.selectedAdditives.map(additive => (
                              <div key={additive.id} className="flex justify-between">
                                <span>{additive.name}</span>
                                <span>+{additive.price} ₽</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span className="text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого:</span>
                  <span className="text-lg font-bold text-[#6de082]">{total} ₽</span>
                </div>
                <button
                  onClick={handlePreorder}
                  className="mt-4 w-full bg-[#6de082] text-white py-2 px-4 rounded-md hover:bg-[#5bc06f] transition-colors"
                >
                  Предзаказ
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 