'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Success() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-[#8ec42e] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-bold mb-4 text-white">Заказ успешно оформлен!</h1>
        <p className="text-lg mb-8 text-white">
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#8ec42e] text-white px-6 py-3 rounded-lg hover:bg-[#7db02a] transition-colors"
        >
          Вернуться на главную
        </button>
      </motion.div>
    </main>
  );
} 