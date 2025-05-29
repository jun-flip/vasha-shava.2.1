'use client';

import { useState, useMemo, useEffect } from "react";
import { useCart } from "./context/CartContext";
import { Category, MenuItem as MenuItemType } from "../types";
import { menuItems } from "../data/menu";
import { MenuItem } from "./components/MenuItem";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';

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
      id: String(item.id),
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  return (
    <main className="pt-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">Сочная шаурма</span>
            <span className="block text-[#8fc52f]">с доставкой за 35 минут</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 max-w-md mx-auto text-base text-white font-semibold sm:text-lg md:mt-5 md:text-xl md:max-w-3xl bg-[#8fc52f]/20 px-6 py-3 rounded-lg"
          >
            Свежие ингредиенты и фирменный соус в каждом ролле
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
          >
            <div className="rounded-md shadow">
              <Link
                href="/menu"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#8fc52f] hover:bg-[#7db02a] md:py-4 md:text-lg md:px-10"
              >
                МЕНЮ
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-6 h-full"
            >
              <div className="flow-root bg-white rounded-lg px-6 pb-4 h-full flex flex-col">
                <div className="-mt-6 flex-grow">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-[#8fc52f] rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    На Молодой Гвардии
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    ул. Молодой Гвардии, 27
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    09:00 - 21:00
                  </p>
                  <p className={`mt-2 text-base font-medium ${isOpen ? 'text-[#8fc52f]' : 'text-red-500'}`}>
                    {isOpen ? 'Открыто' : 'Закрыто'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-6 h-full"
            >
              <div className="flow-root bg-white rounded-lg px-6 pb-4 h-full flex flex-col">
                <div className="-mt-6 flex-grow">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-[#8fc52f] rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Доставка
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Быстрая доставка по городу
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    Среднее время доставки<br /><span className="text-[#8fc52f]">35 минут</span>
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    Бесплатная доставка<br />от 1000₽
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-6 h-full"
            >
              <div className="flow-root bg-white rounded-lg px-6 pb-4 h-full flex flex-col">
                <div className="-mt-6 flex-grow">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-[#8fc52f] rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Предзаказ
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Закажи за ранее
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    Среднее время приготовления<br /><span className="text-[#8fc52f]">5 минут</span>
                  </p>
                  <div className="mt-8"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
