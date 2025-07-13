import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../../types';

interface AddToCartNotificationProps {
  isVisible: boolean;
  item: CartItem;
  onClose: () => void;
}

export default function AddToCartNotification({ isVisible, item, onClose }: AddToCartNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.3 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed md:bottom-4 md:right-4 bottom-1/2 right-1/2 transform md:transform-none translate-x-1/2 md:translate-x-0 translate-y-1/2 md:translate-y-0 
            bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-4 
            max-w-[95vw] w-full md:max-w-sm md:w-full z-[9999] 
            border border-[#6de082]/50"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                Добавлено в корзину
              </h3>
              <p className="text-sm md:text-base text-gray-700 font-medium">{item.name}</p>
              
              {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                <div className="mt-1 md:mt-2">
                  <p className="text-xs md:text-sm text-gray-600">Добавки:</p>
                  <ul className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                    {item.selectedAdditives.map((additive) => (
                      <li key={additive.id} className="text-xs md:text-sm text-gray-600 flex justify-between">
                        <span>{additive.name}</span>
                        <span className="text-[#6de082]">+{additive.price} ₽</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-base md:text-lg font-bold text-[#6de082]">
                  Итого: {item.price + (item.selectedAdditives?.reduce((sum, add) => sum + add.price, 0) || 0)} ₽
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="ml-2 md:ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 