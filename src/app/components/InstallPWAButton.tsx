'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useClickSound } from '../../hooks/useClickSound';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const handleClick = useClickSound();

  useEffect(() => {
    const handler = (e: Event) => {
      // Предотвращаем автоматическое появление баннера установки
      e.preventDefault();
      // Сохраняем событие для последующего использования
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Показываем промпт установки
    deferredPrompt.prompt();

    // Ждем, пока пользователь ответит на промпт
    const { outcome } = await deferredPrompt.userChoice;

    // Сбрасываем сохраненный промпт
    setDeferredPrompt(null);
    setIsInstallable(false);

    // Опционально: отправляем аналитику
    console.log(`User response to the install prompt: ${outcome}`);
  };

  if (!isInstallable) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick(handleInstallClick)}
      className="fixed bottom-4 right-4 bg-[#8fc52f] text-white p-3 rounded-full shadow-lg hover:bg-[#7db02a] transition-colors z-50"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </motion.button>
  );
} 