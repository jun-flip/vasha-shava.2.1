'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AddToCartAnimationProps {
  item: {
    id: string;
    name: string;
    image: string;
  };
  isVisible: boolean;
}

export function AddToCartAnimation({ item, isVisible }: AddToCartAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3"
        >
          <div className="relative w-12 h-12">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">Добавлено в корзину</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 