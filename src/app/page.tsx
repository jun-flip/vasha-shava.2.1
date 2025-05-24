'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './components/MenuItem';
import { Cart } from './components/Cart';
import { menuItems } from '@/data/menu';
import { CartProvider } from './context/CartContext';
import Image from 'next/image';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'spicy' | 'vegetarian' | 'drinks'>('all');

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <CartProvider>
      <main className="min-h-screen bg-[#5f2dab]">
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 relative mb-8">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8">
                Ваша Шава
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="tel:+79991234567"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-white text-[#5f2dab] font-bold text-xl shadow-xl 
                           hover:bg-[#6de082] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>Позвонить</span>
                </motion.a>
                <motion.button
                  onClick={() => setIsCartOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-[#6de082] text-white font-bold text-xl shadow-xl 
                           hover:bg-white hover:text-[#5f2dab] transition-all duration-200 flex items-center justify-center gap-2"
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
                  <span>Корзина</span>
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-[#6de082] text-white'
                    : 'bg-white text-[#5f2dab] hover:bg-gray-100'
                }`}
              >
                Все
              </button>
              <button
                id="menu-spicy-btn"
                onClick={() => setSelectedCategory('spicy')}
                className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 ${
                  selectedCategory === 'spicy'
                    ? 'bg-[#6de082] text-white'
                    : 'bg-white text-[#5f2dab] hover:bg-gray-100'
                }`}
              >
                Острые 🌶️
              </button>
              <button
                onClick={() => setSelectedCategory('vegetarian')}
                className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 ${
                  selectedCategory === 'vegetarian'
                    ? 'bg-[#6de082] text-white'
                    : 'bg-white text-[#5f2dab] hover:bg-gray-100'
                }`}
              >
                Вегетарианские 🥗
              </button>
              <button
                id="menu-drinks-btn"
                onClick={() => setSelectedCategory('drinks')}
                className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 ${
                  selectedCategory === 'drinks'
                    ? 'bg-[#6de082] text-white'
                    : 'bg-white text-[#5f2dab] hover:bg-gray-100'
                }`}
              >
                Напитки 🥤
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a href="tel:+79991234567" className="bg-white/10 p-6 rounded-2xl block group hover:bg-[#6de082]/10 transition-colors">
                <div className="text-[#6de082] text-3xl mb-4">📞</div>
                <h3 className="text-white font-bold mb-2">Телефон</h3>
                <div className="text-gray-300 group-hover:text-[#6de082] underline transition-colors">+7 (999) 123-45-67</div>
              </a>
              <a href="https://yandex.ru/maps/org/vashashava/128821319174/?ll=52.676651%2C58.137575&z=16" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-6 rounded-2xl block group hover:bg-[#6de082]/10 transition-colors">
                <div className="text-[#6de082] text-3xl mb-4">📍</div>
                <h3 className="text-white font-bold mb-2">Адрес</h3>
                <div className="text-gray-300 group-hover:text-[#6de082] underline transition-colors">Сибирская ул., 6, Глазов</div>
              </a>
              <div className="bg-white/10 p-6 rounded-2xl">
                <div className="text-[#6de082] text-3xl mb-4">⏰</div>
                <h3 className="text-white font-bold mb-2">Время работы</h3>
                <p className="text-gray-300">10:00 - 22:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cart */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </main>
    </CartProvider>
  );
}
