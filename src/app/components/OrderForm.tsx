'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface OrderFormProps {
  onClose: () => void;
}

export function OrderForm({ onClose }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Новый заказ:\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nАдрес: ${formData.address}`;
    const botToken = '7955773373:AAEKm-UWGKW5WDZCGDcjpzYhedFXN6cO7QE';
    const chatId = 'YOUR_CHAT_ID'; // Замените на ID вашей группы

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        alert('Заказ успешно отправлен!');
        onClose();
      } else {
        alert('Ошибка при отправке заказа. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Ошибка при отправке заказа. Попробуйте позже.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-[#232323] rounded-2xl p-8 shadow-xl border-2 border-[#6de082]"
    >
      <h2 className="text-3xl font-extrabold text-white mb-6 graffiti-title">Оформить заказ</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white font-bold mb-2">
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-black text-white border-2 border-[#6de082] rounded-lg focus:outline-none focus:border-[#6de082]"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-white font-bold mb-2">
            Адрес
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 bg-black text-white border-2 border-[#6de082] rounded-lg focus:outline-none focus:border-[#6de082]"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-white font-bold mb-2">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-black text-white border-2 border-[#6de082] rounded-lg focus:outline-none focus:border-[#6de082]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#6de082] text-black font-extrabold py-3 rounded-lg hover:bg-black hover:text-[#6de082] transition-colors duration-200"
        >
          Заказать
        </button>
      </div>
    </motion.form>
  );
} 