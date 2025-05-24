'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const router = useRouter();
  const { clearCart, items, total } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    time: '',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Отправляем заказ в Telegram
      const telegramResponse = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items,
          total
        }),
      });

      const telegramResult = await telegramResponse.json();

      if (!telegramResult.success) {
        throw new Error('Failed to send order to Telegram');
      }

      // Очищаем корзину и перенаправляем на страницу успеха
      clearCart();
      router.push('/success');
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    router.push('/menu');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 bg-[#6de082] text-white px-4 py-2 rounded-lg hover:bg-[#5bc06f] transition-colors"
        >
          В меню
        </button>

        <h1 className="text-3xl font-bold mb-8 text-white">Оформление заказа</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-900 mb-1">
              К какому времени приготовить
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              min="09:00"
              max="21:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-900 mb-1">
              Комментарий к заказу (необязательно)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6de082] text-white py-3 rounded-lg hover:bg-[#5bc06f] transition-colors font-semibold text-lg"
          >
            Подтвердить заказ
          </button>
        </form>
      </div>
    </main>
  );
} 