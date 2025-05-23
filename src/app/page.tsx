'use client';

import { useState, useMemo, useEffect } from "react";
import { useCart } from "./context/CartContext";
import { Category, MenuItem as MenuItemType } from "../types";
import { menuItems } from "../data/menu";
import { MenuItem } from "./components/MenuItem";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { PromoBanner } from './components/PromoBanner';

export default function Home() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const checkIsOpen = () => {
      const dubaiTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' });
      const currentHour = new Date(dubaiTime).getHours();
      setIsOpen(currentHour >= 9 && currentHour < 21);
    };

    checkIsOpen();
    const interval = setInterval(checkIsOpen, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, []);

  const filteredItems = useMemo(() => 
    menuItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory),
    [selectedCategory]
  );

  const handleAddToCart = (item: MenuItemType) => {
    addItem({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
      selectedAdditives: [],
    });
  };

  return (
    <main className="min-h-screen bg-[#181818] flex flex-col items-center justify-between">
      <section className="w-full relative bg-black pb-20 pt-16 md:pt-24">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight graffiti-title"
          >
            Ваша шаурма
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-3xl md:text-4xl font-black text-[#6de082] mb-6 graffiti-subtitle"
          >
            STREET FOOD
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="max-w-xl mx-auto text-lg md:text-2xl text-gray-200 mb-8 font-semibold"
          >
            Любовь с первого укуса. Без очередей. Только уличный вайб.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/menu"
              className="px-10 py-4 rounded-full bg-[#6de082] text-black font-extrabold text-xl shadow-xl border-4 border-black hover:bg-black hover:text-[#6de082] hover:border-[#6de082] transition-colors duration-200 graffiti-btn"
            >
              МЕНЮ
            </Link>
            <span className={`inline-block px-6 py-2 rounded-full font-bold text-base border-2 border-[#6de082] text-[#6de082] bg-black/70 ml-0 sm:ml-2 graffiti-sticker`}>{isOpen ? 'Открыто' : 'Закрыто'}</span>
          </motion.div>
        </div>
        {/* Граффити-деталь */}
        <div className="absolute left-0 bottom-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none opacity-60">
          <Image src="/graffiti1.png" alt="graffiti" fill className="object-contain" />
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none select-none opacity-60">
          <Image src="/graffiti2.png" alt="graffiti" fill className="object-contain" />
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-white mb-10 graffiti-title"
        >
          Где нас найти?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#232323] rounded-2xl p-8 shadow-xl border-2 border-[#6de082] flex flex-col items-start graffiti-card">
            <h3 className="text-2xl font-bold text-[#6de082] mb-2">На Свободе</h3>
            <p className="text-gray-200 mb-1">ул. Площадь Свободы, 6А</p>
            <p className="text-gray-400 mb-1">09:00 - 21:00</p>
            <span className={`inline-block mt-2 px-4 py-1 rounded-full font-bold text-sm border-2 border-[#6de082] text-[#6de082] bg-black/70 graffiti-sticker`}>{isOpen ? 'Открыто' : 'Закрыто'}</span>
          </div>
          <div className="bg-[#232323] rounded-2xl p-8 shadow-xl border-2 border-[#6de082] flex flex-col items-start graffiti-card">
            <h3 className="text-2xl font-bold text-[#6de082] mb-2">На Сибирской</h3>
            <p className="text-gray-200 mb-1">ул. Сибирская, 6</p>
            <p className="text-gray-400 mb-1">09:00 - 21:00</p>
            <span className={`inline-block mt-2 px-4 py-1 rounded-full font-bold text-sm border-2 border-[#6de082] text-[#6de082] bg-black/70 graffiti-sticker`}>{isOpen ? 'Открыто' : 'Закрыто'}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
