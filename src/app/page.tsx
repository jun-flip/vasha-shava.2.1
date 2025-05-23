'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OrderForm } from './components/OrderForm';

export default function Home() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#181818] flex flex-col items-center justify-center">
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
            <button
              onClick={() => setIsOrderFormOpen(true)}
              className="px-10 py-4 rounded-full bg-[#6de082] text-black font-extrabold text-xl shadow-xl border-4 border-black hover:bg-black hover:text-[#6de082] hover:border-[#6de082] transition-colors duration-200 graffiti-btn"
            >
              Заказать
            </button>
          </motion.div>
        </div>
      </section>
      {isOrderFormOpen && <OrderForm onClose={() => setIsOrderFormOpen(false)} />}
    </main>
  );
}
