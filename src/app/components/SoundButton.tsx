'use client';

import React from 'react';
import { useClickSound } from '../hooks/useClickSound';

interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function SoundButton({ children, onClick, ...props }: SoundButtonProps) {
  const handleClick = useClickSound();

  return (
    <button
      {...props}
      onClick={handleClick(onClick)}
    >
      {children}
    </button>
  );
} 