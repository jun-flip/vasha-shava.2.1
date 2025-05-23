'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Preorder() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Предзаказ
          </h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-2">Позвоните нам для оформления заказа:</p>
            <a 
              href="tel:89120123570" 
              className="text-2xl font-bold text-[#6de082] hover:text-[#5bc06f] transition-colors"
            >
              8 (912) 012-35-70
            </a>
          </div>

          <div className="space-y-4">
            <a
              href="tel:89120123570"
              className="block w-full bg-[#6de082] text-white py-3 px-6 rounded-lg hover:bg-[#5bc06f] transition-colors font-semibold text-lg"
            >
              Позвонить
            </a>
            
            <Link
              href="/menu"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-lg"
            >
              Обратно в меню
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 