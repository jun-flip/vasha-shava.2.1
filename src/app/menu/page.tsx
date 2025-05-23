'use client';

import { useState, useMemo } from 'react';
import { menuItems } from '../../data/menu';
import { MenuItem } from '../components/MenuItem';
import { Category } from '../../types';
import { motion } from 'framer-motion';

const categories: { label: string; value: Category | 'spicy' }[] = [
  { label: 'Классика', value: 'all' },
  { label: 'Острое', value: 'spicy' },
  { label: 'Фалафель', value: 'vegetarian' },
  { label: 'Напитки', value: 'drinks' },
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'spicy'>('all');

  const filteredItems = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          selectedCategory === 'all'
            ? item.category === 'all'
            : item.category === selectedCategory
      ),
    [selectedCategory]
  );

  return (
    <main className="min-h-screen bg-[#181818] pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 tracking-tight drop-shadow-lg"
        >
          Меню
        </motion.h1>
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-bold text-lg border-2 transition-all duration-150 uppercase tracking-wider shadow-md
                ${selectedCategory === cat.value
                  ? 'bg-[#6de082] text-black border-[#6de082] scale-105'
                  : 'bg-black text-white border-[#333] hover:bg-[#232323] hover:border-[#6de082] hover:text-[#6de082]'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-white text-xl py-20">
              Нет позиций в этой категории
            </div>
          ) : (
            filteredItems.map((item) => <MenuItem key={item.id} item={item} />)
          )}
        </div>
      </div>
    </main>
  );
} 