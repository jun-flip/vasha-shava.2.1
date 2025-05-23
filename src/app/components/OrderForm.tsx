'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки заказа
    console.log(formData);
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