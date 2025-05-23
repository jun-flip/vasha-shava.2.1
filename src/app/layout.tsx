import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Ваша Шава - Вкусная шаурма с доставкой",
  description: "Закажите вкусную шаурму с доставкой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <Navigation />
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
