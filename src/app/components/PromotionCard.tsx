'use client';

import { Promotion } from '../../types';
import { motion } from 'framer-motion';

interface PromotionCardProps {
  promotion: Promotion;
  onApply: (code: string) => void;
  isApplied?: boolean;
}

export function PromotionCard({ promotion, onApply, isApplied = false }: PromotionCardProps) {
  const isExpired = new Date(promotion.validUntil) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border rounded-lg ${
        isExpired ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold mb-1">{promotion.description}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {promotion.type === 'percentage'
              ? `Скидка ${promotion.discount}%`
              : `Скидка ${promotion.discount} ₽`}
          </p>
          {promotion.minOrderAmount && (
            <p className="text-sm text-gray-500">
              Минимальная сумма заказа: {promotion.minOrderAmount} ₽
            </p>
          )}
          <p className="text-sm text-gray-500">
            Действует до: {new Date(promotion.validUntil).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg mb-2">{promotion.code}</div>
          {!isExpired && (
            <button
              onClick={() => onApply(promotion.code)}
              disabled={isApplied}
              className={`px-4 py-2 rounded-lg text-sm ${
                isApplied
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#6de082] text-white hover:bg-[#5bc06f]'
              }`}
            >
              {isApplied ? 'Применено' : 'Применить'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 