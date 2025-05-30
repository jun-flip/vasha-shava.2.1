'use client';

import React, { createContext, useContext, useRef } from 'react';

interface SoundContextType {
  playClickSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/bubbles4.mp3');
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.error('Ошибка при воспроизведении звука:', error);
    });
  };

  return (
    <SoundContext.Provider value={{ playClickSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
} 