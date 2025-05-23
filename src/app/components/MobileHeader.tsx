'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart } from 'lucide-react';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();

  const menuItems = [
    { name: 'Меню', href: '/' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Ваша Шава
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6de082] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-8">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-xl font-medium text-gray-900 hover:text-[#6de082] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 