import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import { NotificationProvider } from "./context/NotificationContext";
import { CartDropdownProvider } from './context/CartDropdownContext';
import CartDropdownWrapper from './components/CartDropdownWrapper';

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['800'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Ваша Шава",
  description: "Заказ шавермы онлайн",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#8fc52f" />
        <meta name="description" content="Ваша Шава - доставка вкусной шаурмы" />
        <link rel="icon" href="/lavash.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ваша Шава" />
      </head>
      <body className={`${inter.className} ${montserrat.variable}`}>
        <CartProvider>
          <NotificationProvider>
            <CartDropdownProvider>
              <Navigation />
              <CartDropdownWrapper />
              {children}
            </CartDropdownProvider>
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
