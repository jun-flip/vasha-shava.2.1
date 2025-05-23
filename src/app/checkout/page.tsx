'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Здесь будет логика отправки заказа на сервер
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Заказ успешно отправлен:', result);
        // После успешной отправки перенаправить на страницу успеха
        clearCart();
        router.push('/success');
      } else {
        console.error('Ошибка при отправке заказа:', result.message);
        // Обработка ошибки, например, вывод сообщения пользователю
        alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      // Обработка ошибки сети или другой непредвиденной ошибки
      alert('Произошла ошибка сети. Проверьте ваше соединение.');
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
    router.back(); // Возвращаемся на предыдущую страницу
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto relative">
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Оформление заказа</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Адрес доставки
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий к заказу (необязательно)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6de082] focus:border-[#6de082] outline-none"
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