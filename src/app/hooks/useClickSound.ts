import { useCallback } from 'react';
import { useSound } from '../context/SoundContext';

export function useClickSound() {
  const { playClickSound } = useSound();

  return useCallback((callback?: () => void) => {
    return () => {
      playClickSound();
      if (callback) {
        callback();
      }
    };
  }, [playClickSound]);
} 