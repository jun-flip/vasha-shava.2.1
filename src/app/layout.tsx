import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { CartDropdownProvider } from "./context/CartDropdownContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ваша Шава",
  description: "Закажите вкусную шаверму с доставкой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = !!process.env.VERCEL;

  return (
    <html lang="ru">
      <head>
        <meta name="format-detection" content="telephone=yes" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <CartDropdownProvider>
            <NotificationProvider>
              <Navigation />
              {children}
              <Toaster position="top-center" />
            </NotificationProvider>
          </CartDropdownProvider>
        </CartProvider>
        {isVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
