import Link from 'next/link';

export default function Success() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Заказ успешно оформлен!
          </h1>
          <p className="text-gray-600">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Номер вашего заказа: #{Math.floor(Math.random() * 10000)}
          </p>
          <p className="text-gray-700">
            Примерное время доставки: 30-45 минут
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-block bg-[#6de082] text-white px-8 py-3 rounded-lg hover:bg-[#5bc06f] transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
} 