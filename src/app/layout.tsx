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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/lavash.ico" sizes="any" />
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
