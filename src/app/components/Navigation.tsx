'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartDropdown from './CartDropdown';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, cartUpdateSignal, totalItems } = useCart();
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    if (cartUpdateSignal > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500); // Длительность анимации
      return () => clearTimeout(timer);
    }
  }, [cartUpdateSignal]);

  const cartVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1], transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <nav className="bg-[#663bb8] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center py-2">
              <div className="relative w-12 h-12 mr-2">
                <Image
                  src="/Logo.png"
                  alt="Ваша Шава логотип"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">Ваша Шава</span>
            </Link>
          </div>

          <div className="flex items-center">
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-gray-200 transition-colors"
              variants={cartVariants}
              animate={animateCart ? "animate" : "initial"}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#6de082] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </motion.button>
            <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
} 