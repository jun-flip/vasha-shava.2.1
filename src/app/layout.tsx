import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import { NotificationProvider } from "./context/NotificationContext";
import { CartDropdownProvider } from './context/CartDropdownContext';
import CartDropdownWrapper from './components/CartDropdownWrapper';
import { SoundProvider } from './context/SoundContext';

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="ЛАВАШ - доставка вкусной еды" />
        <link rel="icon" href="/lavash.ico" />
        <title>ЛАВАШ - доставка вкусной еды</title>
      </head>
      <body className={`${inter.className} ${montserrat.variable}`}>
        <CartProvider>
          <NotificationProvider>
            <CartDropdownProvider>
              <SoundProvider>
          <Navigation />
          {children}
                <CartDropdownWrapper />
              </SoundProvider>
            </CartDropdownProvider>
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
