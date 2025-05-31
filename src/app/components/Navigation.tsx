'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useCartDropdown } from '../context/CartDropdownContext';
import { motion } from 'framer-motion';
import { useClickSound } from '../../hooks/useClickSound';

export default function Navigation() {
  const pathname = usePathname();
  const { items } = useCart();
  const { openCart } = useCartDropdown();
  const handleClick = useClickSound();

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] }
  };

  const animateCart = totalItems > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#272727] shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center py-2" onClick={handleClick(() => {})}>
              <div className="relative w-16 h-16 mr-2">
                <Image
                  src="/Logo.png"
                  alt="ЛАВАШ логотип"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold text-white font-montserrat tracking-wider">ЛАВАШ</span>
            </Link>
          </div>

          <div className="flex items-center">
            <motion.button
              onClick={handleClick(openCart)}
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
          </div>
        </div>
      </div>
    </header>
  );
} 