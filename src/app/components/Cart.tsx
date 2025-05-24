'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { MenuItem, Additive } from '@/types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const additiveIcons: Record<string, string> = {
  'Больше мяса': '🥩',
  'Больше фалафеля': '🧆',
  'Сыр': '🧀',
  'Овощи': '🥗',
  'Фирменный соус': '🫙',
};

function AdditivesSelector({ additives, selected, onChange }: { additives: Additive[]; selected: string[]; onChange: (id: string) => void }) {
  return (
    <div className="space-y-2 mt-4 w-full">
      <div className="font-semibold mb-2 text-gray-800">Добавки:</div>
      {additives.map(add => (
        <label key={add.id} className="flex items-center gap-2 text-sm cursor-pointer text-black">
          <input
            type="checkbox"
            checked={selected.includes(add.id)}
            onChange={() => onChange(add.id)}
            className="accent-[#6de082] w-4 h-4"
          />
          <span className="flex items-center gap-1 text-black">
            <span>{additiveIcons[add.name] || '➕'}</span>
            <span>{add.name}</span>
            <span className="text-gray-400">+{add.price}₽</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart, addToCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editAdditives, setEditAdditives] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Введите имя';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) newErrors.phone = 'Введите корректный номер телефона';
    if (!address.trim()) newErrors.address = 'Введите адрес доставки';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          items,
          totalAmount,
        }),
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setTimeout(() => {
          onClose();
          setOrderSuccess(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setEditQuantity(item.quantity || 1);
    setEditAdditives(item.selectedAdditives?.map((a: Additive) => a.id) || []);
  };

  const handleSaveEdit = () => {
    removeFromCart(
      editItem.id,
      editItem.selectedAdditives
    );
    addToCart({
      ...editItem,
      quantity: editQuantity,
      selectedAdditives: editItem.additives?.filter((a: Additive) => editAdditives.includes(a.id)) || [],
    });
    setEditItem(null);
    setEditQuantity(1);
    setEditAdditives([]);
  };

  // Проверка на шаверму без добавок
  const shawarmaIds = [1, 2, 3, 4];
  const shawarmaWithoutAdditives = items.filter(item => shawarmaIds.includes(item.id) && (!item.selectedAdditives || item.selectedAdditives.length === 0));
  // Проверка на отсутствие напитков
  const hasDrinks = items.some(item => item.category === 'drinks');
  const onlyShawarma = items.length > 0 && items.every(item => shawarmaIds.includes(item.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#5f2dab]/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="popup-content bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {orderSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="text-[#6de082] text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">Заказ оформлен!</h3>
                <p className="text-gray-600">Мы свяжемся с вами в ближайшее время</p>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Корзина</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

      {items.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">🛒</div>
                    <p className="text-gray-500 text-lg">Ваша корзина пуста</p>
                  </div>
      ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {shawarmaWithoutAdditives.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl mb-2 text-sm text-yellow-900 flex items-center gap-4">
                          <span>Добавьте сыр, овощи или фирменный соус — будет ещё вкуснее!</span>
                          <button
                            onClick={() => handleEdit(shawarmaWithoutAdditives[0])}
                            className="px-3 py-1 bg-[#6de082] !text-white rounded-full font-bold text-xs hover:bg-[#5bc070] transition-colors"
                          >
                            К добавкам
                          </button>
                        </div>
                      )}
                      {items.map(item => (
                        <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
                          className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl"
            >
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-[#6de082] font-bold">{item.price} ₽</p>
                            {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                {item.selectedAdditives.map((add: Additive) => (
                                  <span key={add.id} className="flex items-center gap-1 bg-gray-200 rounded px-2 py-0.5">
                                    <span>{additiveIcons[add.name] || '➕'}</span>
                                    <span>{add.name}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-3">
                <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedAdditives)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {item.quantity}
                              </span>
                <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedAdditives)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
                            </div>
                <button
                              onClick={() => handleEdit(item)}
                              className="text-xs text-[#6de082] underline hover:text-[#5bc070]"
                            >
                              Изменить
                            </button>
                <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors text-xs"
                >
                  Удалить
                </button>
              </div>
                        </motion.div>
                      ))}
                    </div>

                    {!hasDrinks && onlyShawarma && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl mb-4 text-sm text-blue-900 flex items-center gap-2 justify-between">
                        <span>К шаверме отлично подойдёт напиток — добавьте колу или сок!</span>
                        <button
                          onClick={() => { onClose(); document.getElementById('menu-drinks-btn')?.click(); }}
                          className="ml-4 px-4 py-2 bg-[#6de082] !text-white rounded-full font-bold text-xs hover:bg-[#5bc070] transition-colors"
                        >
                          Добавить напитки
                        </button>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="text-xl font-bold flex justify-between text-gray-900">
                        <span>Итого:</span>
                        <span>{totalAmount} ₽</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#6de082] focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                          placeholder="Иван"
                        />
                        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Телефон <span className="text-gray-400">(например, +7 (999) 123-45-67)</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#6de082] focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                          placeholder="+7 (999) 123-45-67"
                        />
                        {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Адрес доставки
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#6de082] focus:border-transparent outline-none transition-all ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
                          placeholder="ул. Примерная, д. 1, кв. 1"
                        />
                        {errors.address && <div className="text-xs text-red-500 mt-1">{errors.address}</div>}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || items.length === 0}
                        className="w-full bg-[#6de082] hover:bg-[#5bc070] !text-white font-bold py-3 px-6 rounded-xl
                                 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed
                                 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                          <span>Оформить заказ</span>
                        )}
                      </motion.button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      {editItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#5f2dab]/80 backdrop-blur-sm"
          onClick={() => setEditItem(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="popup-content bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 relative text-left"
          >
            <button
              onClick={() => setEditItem(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-start">
              <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-t-2xl">
                <Image src={editItem.image} alt={editItem.name} fill className="object-cover rounded-t-2xl" />
              </div>
              <div className="p-4 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{editItem.name}</h2>
                <p className="text-gray-600 mb-4">{editItem.description}</p>
                {editItem.additives && editItem.additives.length > 0 && (
                  <AdditivesSelector additives={editItem.additives} selected={editAdditives} onChange={id => setEditAdditives(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])} />
                )}
                <div className="flex items-center gap-4 mt-6 mb-4">
                  <button
                    onClick={() => setEditQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl"
                  >-</button>
                  <span className="text-lg font-bold w-8 text-center text-black">{editQuantity}</span>
                  <button
                    onClick={() => setEditQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl"
                  >+</button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="w-full bg-[#6de082] hover:bg-[#5bc070] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg mt-2"
                >
                  Сохранить
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 