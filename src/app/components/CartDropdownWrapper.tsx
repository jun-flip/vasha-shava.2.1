'use client';

import { useCartDropdown } from '../context/CartDropdownContext';
import CartDropdown from './CartDropdown';
 
export default function CartDropdownWrapper() {
  const { isOpen } = useCartDropdown();
  return isOpen ? <CartDropdown /> : null;
} 