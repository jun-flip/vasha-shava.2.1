'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

interface Address {
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;
}

interface FormData {
  name: string;
  phone: string;
  address: Address;
  comment: string;
  isPickup: boolean;
  pickupTime: string;
}

const STORAGE_KEY = 'checkout_form_data';
const EXPIRY_DAYS = 30;

export default function Checkout() {
  const router = useRouter();
  const { clearCart, items, total } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: {
      street: '',
      house: '',
      apartment: '',
      entrance: '',
      floor: ''
    },
    comment: '',
    isPickup: false,
    pickupTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);

  // Загрузка сохраненных данных при монтировании компонента
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { data, expiry } = JSON.parse(savedData);
        // Проверяем, не истек ли срок хранения
        if (new Date().getTime() < expiry) {
          setFormData(data);
        } else {
          // Если срок истек, удаляем данные
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Ошибка при загрузке сохраненных данных:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Сохранение данных при изменении формы
  useEffect(() => {
    const expiry = new Date().getTime() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const dataToSave = {
      data: formData,
      expiry
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Форматируем адрес или время самовывоза для отправки
      const formattedAddress = formData.isPickup 
        ? `Самовывоз в ${formData.pickupTime}`
        : `${formData.address.street}, д. ${formData.address.house}, кв. ${formData.address.apartment}, подъезд ${formData.address.entrance}, этаж ${formData.address.floor}`;

      // Отправляем заказ в Telegram
      const telegramResponse = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          time: formattedAddress,
          comment: formData.comment,
          items: items,
          total: total
        }),
      });

      if (!telegramResponse.ok) {
        throw new Error(`HTTP error! status: ${telegramResponse.status}`);
      }

      const telegramResult = await telegramResponse.json();

      if (!telegramResult.success) {
        throw new Error(telegramResult.error || 'Failed to send order to Telegram');
      }

      // Очищаем корзину и сохраненные данные формы
      clearCart();
      localStorage.removeItem(STORAGE_KEY);
      router.push('/success');
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  const handleClose = () => {
    router.push('/menu');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 bg-[#8fc52f] text-white px-4 py-2 rounded-lg hover:bg-[#7db02a] transition-colors"
        >
          В меню
        </button>

        <h1 className="text-3xl font-bold mb-8 text-white">Оформление заказа</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPickup"
              name="isPickup"
              checked={formData.isPickup}
              onChange={handleChange}
              className="h-4 w-4 text-[#8fc52f] focus:ring-[#8fc52f] border-gray-300 rounded"
            />
            <label htmlFor="isPickup" className="ml-2 block text-sm text-gray-900">
              Заберу сам
            </label>
          </div>

          {formData.isPickup ? (
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-900 mb-1">
                Время самовывоза
              </label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8fc52f] focus:border-[#8fc52f] outline-none text-gray-900"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label 
                htmlFor="address" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Адрес доставки
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
                placeholder="Введите адрес доставки"
              />
            </div>
          )}

          <div className="mb-4">
            <label 
              htmlFor="comment" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Комментарий к заказу
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
              placeholder="Дополнительная информация для курьера"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#8fc52f] hover:bg-[#7db02a]'
            }`}
          >
            {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
          </button>
        </form>
      </div>
    </main>
  );
} 