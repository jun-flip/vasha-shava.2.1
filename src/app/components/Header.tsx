'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { MobileCart } from './MobileCart';
import { ShoppingCart } from 'lucide-react';

export function Header() {
  const { items } = useCart();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Ваша Шава
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/menu"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Меню
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              О нас
            </Link>
            <Link
              href="/contacts"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Контакты
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 md:hidden"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6de082] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileCart
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
      />
    </header>
  );
} 