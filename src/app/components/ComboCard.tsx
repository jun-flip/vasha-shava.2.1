'use client';

import { Combo } from '../../types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ComboCardProps {
  combo: Combo;
  onAddToCart: (combo: Combo) => void;
}

export function ComboCard({ combo, onAddToCart }: ComboCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={combo.image}
          alt={combo.name}
          fill
          className="object-cover"
        />
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