'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#6de082] text-white p-4 rounded-lg shadow-lg mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Скидка 10% на первый заказ!</h2>
          <p className="text-sm">Используйте промокод: WELCOME10</p>
        </div>
        <div className="relative w-24 h-24">
          <Image
            src="/images/placeholder-shawarma.svg"
            alt="Промо"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </motion.div>
  );
} 