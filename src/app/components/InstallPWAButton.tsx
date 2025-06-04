'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SoundButton from './SoundButton';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Проверяем, является ли устройство мобильным
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Проверяем, установлено ли уже приложение
    const checkInstalled = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        const relatedApps = await (navigator as any).getInstalledRelatedApps();
        if (relatedApps.length > 0) {
          setIsInstallable(false);
          return;
        }
      }

      // Проверяем, запущено ли приложение в standalone режиме
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstallable(false);
        return;
      }

      // Проверяем поддержку PWA
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        setIsInstallable(true);
      }
    };

    checkInstalled();

    // Обработчик события beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Пользователь установил приложение');
    } else {
      console.log('Пользователь отклонил установку');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Показываем кнопку только на главной странице
  if (!isMobile || !isInstallable || pathname !== '/') return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <SoundButton
        onClick={handleInstallClick}
        className="bg-[#8fc52f] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#7db02a] transition-colors flex items-center space-x-2"
      >
        <svg
          className="w-5 h-5"
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
        <span>Установить приложение</span>
      </SoundButton>
    </div>
  );
} 