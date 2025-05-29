'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <main className="min-h-screen pt-32 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Ваша корзина пуста</p>
            <Link href="/" className="text-[#8fc52f] hover:text-[#7db02a]">
              Вернуться к меню
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-24 h-24 bg-gray-200">
                    <Image
                      src="/placeholder.svg"
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="px-2 py-1 border rounded hover:bg-[#8fc52f] hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="px-2 py-1 border rounded hover:bg-[#8fc52f] hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Итого:</span>
                <span className="text-2xl font-bold">{total} ₽</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#8fc52f] text-white py-3 rounded-lg hover:bg-[#7db02a] transition-colors"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 