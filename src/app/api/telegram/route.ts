import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу с счетчиком
const COUNTER_FILE = path.join(process.cwd(), 'order-counter.txt');

// Функция для получения текущего значения счетчика
function getOrderCounter(): number {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const counter = parseInt(fs.readFileSync(COUNTER_FILE, 'utf-8'));
      return isNaN(counter) ? 0 : counter;
    }
    return 0;
  } catch (error) {
    console.error('Ошибка при чтении счетчика:', error);
    return 0;
  }
}

// Функция для сохранения нового значения счетчика
function saveOrderCounter(counter: number): void {
  try {
    fs.writeFileSync(COUNTER_FILE, counter.toString());
  } catch (error) {
    console.error('Ошибка при сохранении счетчика:', error);
  }
}

interface OrderData {
  name: string;
  phone: string;
  time: string;
  items: Array<{
    name: string;
    price: number;
    quantity?: number;
    selectedAdditives?: Array<{
      name: string;
      price: number;
    }>;
  }>;
  total: number;
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json();

    // Получаем текущее значение счетчика и увеличиваем его
    const orderCounter = getOrderCounter() + 1;
    saveOrderCounter(orderCounter);

    // Формируем ID заказа (счетчик с ведущими нулями)
    const orderId = orderCounter.toString().padStart(4, '0');

    // Формируем сообщение для Telegram
    const message = `
🆕 Новый заказ #${orderId}

👤 Имя: ${orderData.name}
📱 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.time}

🍽 Заказ:
${orderData.items.map(item => {
  const additives = item.selectedAdditives?.length 
    ? `\n   + ${item.selectedAdditives.map(a => `${a.name} (+${a.price}₽)`).join('\n   + ')}`
    : '';
  return `• ${item.name} x${item.quantity || 1} - ${item.price * (item.quantity || 1)}₽${additives}`;
}).join('\n')}
${orderData.total < 1000 ? '\n🚚 Доставка - 200₽' : ''}

💰 Итого: ${orderData.total}₽
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return NextResponse.json(
      { error: 'Failed to send message to Telegram' },
      { status: 500 }
    );
  }
} 