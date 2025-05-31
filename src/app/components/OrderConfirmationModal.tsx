'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import SoundButton from './SoundButton';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function OrderConfirmationModal({ isOpen, onClose, total }: OrderConfirmationModalProps) {
  const router = useRouter();
  const { items } = useCart();
  const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);

  // Закрываем модальное окно, если корзина пуста
  useEffect(() => {
    if (isOpen && (items.length === 0 || total === 0)) {
      onClose();
    }
  }, [isOpen, items.length, total, onClose]);

  const handleClose = () => {
    setShowEmptyCartMessage(false);
    onClose();
  };

  const handleConfirm = () => {
    onClose();
    router.push('/checkout');
  };

  // Не показываем модальное окно, если корзина пуста
  if (items.length === 0 || total === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              duration: 0.3,
              bounce: 0.2
            }}
              className="bg-white rounded-lg p-4 sm:p-6 max-w-[280px] sm:max-w-md md:max-w-lg w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Подтверждение заказа</h3>
                <SoundButton
                  onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </SoundButton>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Сумма заказа: <span className="font-semibold text-[#6de082]">{total} ₽</span></p>
              <p className="text-gray-600">Хотите оформить заказ?</p>
            </div>

            <div className="flex space-x-4">
                <SoundButton
                  onClick={handleClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Отмена
                </SoundButton>
                <SoundButton
                onClick={handleConfirm}
                className="flex-1 bg-[#6de082] text-white py-2 px-4 rounded-md hover:bg-[#5bc06f] transition-colors"
              >
                Оформить
                </SoundButton>
            </div>
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 