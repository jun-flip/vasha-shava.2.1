'use client';

import { useState } from 'react';
import { menuItems } from '../../data/menu';
import { MenuItem } from '../components/MenuItem';
import { OrderForm } from '../components/OrderForm';
import { motion } from 'framer-motion';

export default function MenuPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const handleItemSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  return (
    <main className="min-h-screen bg-[#181818] flex flex-col items-center justify-center">
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-10 graffiti-title">Меню</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              onSelect={handleItemSelect}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsOrderFormOpen(true)}
            className="px-10 py-4 rounded-full bg-[#6de082] text-black font-extrabold text-xl shadow-xl border-4 border-black hover:bg-black hover:text-[#6de082] hover:border-[#6de082] transition-colors duration-200 graffiti-btn"
          >
            Заказать
          </button>
        </div>
      </section>
      {isOrderFormOpen && <OrderForm onClose={() => setIsOrderFormOpen(false)} />}
    </main>
  );
} 