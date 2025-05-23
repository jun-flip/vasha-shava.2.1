'use client';

import { useState, useMemo } from 'react';
import { Category } from '../../types';
import { menuItems } from '../../data/menu';
import { MenuItem } from '../components/MenuItem';
import { motion } from 'framer-motion';

const categories: Category[] = ['all', 'spicy', 'vegetarian', 'drinks'];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredItems = useMemo(() => 
    menuItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <main className="min-h-screen py-12">
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
                    ? 'bg-[#6de082] text-white'
                    : 'bg-white text-gray-800 hover:bg-[#6de082] hover:text-white'
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </main>
  );
} 