import { useCallback } from 'react';

export function useClickSound() {
  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/bubbles4.mp3');
    audio.play().catch(error => console.log('Ошибка воспроизведения звука:', error));
  }, []);

  return useCallback((callback: () => void) => {
    return () => {
      playSound();
      callback();
    };
  }, [playSound]);
} 