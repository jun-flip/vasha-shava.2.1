'use client';

import { useCart } from '../context/CartContext';
import { useCartDropdown } from '../context/CartDropdownContext';
import { useClickSound } from '../hooks/useClickSound';
import SoundButton from './SoundButton';

export default function CartButton() {
  const { items } = useCart();
  const { openCart } = useCartDropdown();
  const handleClick = useClickSound();

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <SoundButton
      onClick={handleClick(openCart)}
      className="relative flex items-center space-x-2 bg-[#6de082] text-white px-4 py-2 rounded-lg hover:bg-[#5bc06f] transition-colors"
    >
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="font-medium text-base md:text-lg">{totalPrice} ₽</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </SoundButton>
  );
} 