'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#5f2dab] to-[#7c4dff] text-white py-8 border-t-2 border-[#6de082]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-extrabold text-[#6de082] mb-4 graffiti-title">Ваша Шава</h3>
            <p className="text-gray-300">Любовь с первого укуса. Без очередей. Только уличный вайб.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#6de082] mb-4">Контакты</h3>
            <p className="text-gray-300">ул. Площадь Свободы, 6А</p>
            <p className="text-gray-300">ул. Сибирская, 6</p>
            <p className="text-gray-300">09:00 - 21:00</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#6de082] mb-4">Ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-[#6de082] transition-colors duration-200">
                  Меню
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#6de082] transition-colors duration-200">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-[#6de082] transition-colors duration-200">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2023 Ваша Шава. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
} 