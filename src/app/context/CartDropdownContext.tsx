'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartDropdownContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartDropdownContext = createContext<CartDropdownContextType | undefined>(undefined);

export function CartDropdownProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartDropdownContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartDropdownContext.Provider>
  );
}

export function useCartDropdown() {
  const context = useContext(CartDropdownContext);
  if (context === undefined) {
    throw new Error('useCartDropdown must be used within a CartDropdownProvider');
  }
  return context;
} 