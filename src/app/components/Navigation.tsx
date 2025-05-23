'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartDropdown from './CartDropdown';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#663bb8] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center py-2">
              <div className="relative w-12 h-12 mr-2">
                <Image
                  src="/Logo.png"
                  alt="Ваша Шава логотип"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">Ваша Шава</span>
            </Link>
          </div>

          <div className="flex items-center">
            <CartDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
} 