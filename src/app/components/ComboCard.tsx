'use client';

import { Combo } from '../../types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ComboCardProps {
  combo: Combo;
  onAddToCart: (combo: Combo) => void;
}

export function ComboCard({ combo, onAddToCart }: ComboCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        {imageError ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <Image
            src={combo.image}
            alt={combo.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={combo.isPopular}
          />
        )}
        {combo.isPopular && (
          <div className="absolute top-2 right-2 bg-[#6de082] text-white px-2 py-1 rounded-full text-sm">
            Популярное
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{combo.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{combo.description}</p>
        
        <div className="space-y-2 mb-4">
          {combo.items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">•</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{combo.price} ₽</span>
            {combo.discount > 0 && (
              <span className="ml-2 text-sm text-[#6de082]">
                -{combo.discount}%
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(combo)}
            className="bg-[#6de082] text-white px-4 py-2 rounded-lg hover:bg-[#5bc06f] transition-colors"
          >
            В корзину
          </button>
        </div>
      </div>
    </motion.div>
  );
} 