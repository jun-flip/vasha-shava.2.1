'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import SoundButton from './SoundButton';
import { CartItem } from '../../types';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  total?: number;
  items?: CartItem[];
  name?: string;
  phone?: string;
  address?: string;
  comment?: string;
  fromBot?: boolean;
}

export default function OrderConfirmationModal({ isOpen, onClose, total, items, name, phone, address, comment, fromBot }: OrderConfirmationModalProps) {
  const router = useRouter();
  const cartContext = useCart();
  const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);
  // Используем данные из пропсов, если они есть (бот), иначе из корзины
  const orderItems = items ?? cartContext?.items ?? [];
  const orderTotal = typeof total === 'number' ? total : cartContext?.total ?? 0;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });

  // Функция для синхронизации данных с корзиной
  const syncDataWithCart = () => {
    if (fromBot && items && cartContext) {
      console.log('OrderConfirmationModal: syncDataWithCart вызвана');
      console.log('OrderConfirmationModal: текущие товары в корзине:', cartContext.items);
      console.log('OrderConfirmationModal: товары для добавления:', items);
      
      // Проверяем, есть ли уже товары в корзине
      if (cartContext.items.length === 0) {
        console.log('OrderConfirmationModal: корзина пустая, добавляем товары');
        // Добавляем все блюда в корзину
        items.forEach((item, index) => {
          cartContext.addItem({
            id: `bot-modal-${index}`,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            selectedAdditives: item.selectedAdditives || []
          });
        });
        
        // Сохраняем корзину в localStorage
        const cartItems = items.map((item, index) => ({
          id: `bot-modal-${index}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          selectedAdditives: item.selectedAdditives || []
        }));
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('OrderConfirmationModal: корзина сохранена в localStorage:', cartItems);
      } else {
        console.log('OrderConfirmationModal: корзина уже содержит товары, не изменяем');
      }
    }
  };

  // Инициализация формы из пропсов только при первом открытии модалки (fromBot)
  useEffect(() => {
    if (isOpen && fromBot) {
      setForm({
        name: name || '',
        phone: phone || '',
        address: address || '',
        comment: comment || ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fromBot]);

  // Закрываем модальное окно, если корзина пуста
  useEffect(() => {
    if (isOpen && (orderItems.length === 0 || orderTotal === 0)) {
      onClose();
    }
  }, [isOpen, orderItems.length, orderTotal, onClose]);

  const handleClose = () => {
    setShowEmptyCartMessage(false);
    onClose();
  };

  const handleConfirm = () => {
    onClose();
    router.push('/checkout');
  };

  // Не показываем модальное окно, если корзина пуста
  if (orderItems.length === 0 || orderTotal === 0) {
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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[95vw] sm:max-w-md md:max-w-lg"
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
            className="bg-white rounded-lg p-4 sm:p-8 w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">Подтверждение заказа</h3>
              <SoundButton
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </SoundButton>
            </div>
            {fromBot ? (
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Имя</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Телефон</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Адрес / Самовывоз</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Комментарий</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white" value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Блюда</label>
                  <ul className="list-disc pl-5 text-black text-base">
                    {orderItems.map((item, idx) => (
                      <li key={idx}>{item.name} x{item.quantity} — {item.price * (item.quantity || 1)}₽</li>
                    ))}
                  </ul>
                </div>
                <div className="font-bold text-lg text-black mt-2">Итого: {orderTotal}₽</div>
                <button
                  type="button"
                  className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold shadow"
                  onClick={async () => {
                    onClose();
                    
                    // Синхронизируем данные с корзиной
                    syncDataWithCart();
                    
                    // Формируем строковый адрес для сохранения
                    const addressString = form.address.toLowerCase().includes('самовывоз')
                      ? form.address
                      : form.address;
                    const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
                    localStorage.setItem('checkout_form_data', JSON.stringify({
                      data: {
                        name: form.name,
                        phone: form.phone,
                        address: addressString,
                        comment: form.comment,
                        isPickup: form.address?.toLowerCase().includes('самовывоз'),
                        pickupTime: extractPickupTime(form.address)
                      },
                      expiry
                    }));
                    
                    setTimeout(() => {
                      window.location.href = '/success';
                    }, 200);
                  }}
                >
                  Подтвердить заказ
                </button>
              </form>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-900 mb-2">Сумма заказа: <span className="font-semibold text-black">{orderTotal} ₽</span></p>
                  <p className="text-gray-900">Хотите оформить заказ?</p>
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
              </>
            )}
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 

// Добавляю вспомогательные функции для парсинга адреса и времени самовывоза
function parseAddress(address: string) {
  if (address.toLowerCase().includes('самовывоз')) {
    return {
      street: '', house: '', apartment: '', entrance: '', floor: ''
    };
  }
  // Пробуем вытащить поля из строки адреса
  const match = address.match(/(.+), д\. (.+), кв\. (.+), подъезд (.+), этаж (.+)/);
  if (match) {
    return {
      street: match[1] || '',
      house: match[2] || '',
      apartment: match[3] || '',
      entrance: match[4] || '',
      floor: match[5] || ''
    };
  }
  return { street: '', house: '', apartment: '', entrance: '', floor: '' };
}
function extractPickupTime(address: string) {
  if (address.toLowerCase().includes('самовывоз')) {
    const match = address.match(/(\d{1,2}:\d{2})/);
    return match ? match[1] : '';
  }
  return '';
} 