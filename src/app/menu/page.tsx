'use client';

import { useState, useMemo } from 'react';
import { Category } from '../../types';
import { menuItems } from '../../data/menu';
import MenuItem from '../components/MenuItem';
import { motion } from 'framer-motion';
import { NotificationProvider } from '../context/NotificationContext';

const categories: Category[] = ['all', 'spicy', 'vegetarian', 'drinks'];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [showWelcome, setShowWelcome] = useState(true);

  const filteredItems = useMemo(() => 
    menuItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <NotificationProvider>
      {/* Pop-up приветствие */}
      {showWelcome && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={e => {
            if (e.target === e.currentTarget) setShowWelcome(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-[#8fc52f]">Здравствуйте! 👋</h2>
            <p className="text-lg mb-2 text-black">Меня зовут <span className="font-bold text-[#8fc52f]">Лавашик</span>,<br/>могу помочь вам с заказом</p>
            <p className="text-lg mb-6">Я помогу оформить заказ</p>
            <button
              onClick={() => {
                setShowWelcome(false);
                if (typeof window !== 'undefined' && (window as any).openVashaShavaChat) {
                  (window as any).openVashaShavaChat();
                }
              }}
              className="px-6 py-2 bg-[#8fc52f] text-white rounded-lg font-semibold hover:bg-[#7db02a] transition-colors"
            >
              Выбрать
            </button>
          </div>
        </div>
      )}
      <main className="min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                  selectedCategory === category
                      ? 'bg-[#8fc52f] text-white'
                      : 'bg-white text-gray-800 hover:bg-[#8fc52f] hover:text-white'
                }`}
              >
                {category === 'all' && 'Все'}
                {category === 'spicy' && 'Острое'}
                {category === 'vegetarian' && 'Вегетарианское'}
                {category === 'drinks' && 'Напитки'}
              </motion.button>
            ))}
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
          </div>
      </div>
    </main>
    </NotificationProvider>
  );
} 