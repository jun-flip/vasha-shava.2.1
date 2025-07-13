import { NextResponse } from 'next/server';
import {
  getLastOrderNumber,
  createOrder,
  initializeDatabase
} from '@/lib/database';

// Проверка наличия необходимых переменных окружения для Telegram
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is not defined - Telegram notifications will be disabled');
}
if (!process.env.TELEGRAM_CHAT_ID) {
  console.warn('TELEGRAM_CHAT_ID is not defined - Telegram notifications will be disabled');
}

// Инициализация базы данных (на всякий случай)
initializeDatabase();

// Функция валидации данных заказа
function validateOrderData(data: any) {
  const { name, phone, address, items, total } = data;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Invalid name');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    throw new Error('Invalid phone');
  }
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    throw new Error('Invalid address');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid items');
  }
  if (typeof total !== 'number' || total <= 0) {
    throw new Error('Invalid total');
  }
}

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(orderData: {
  order_number: number;
  name: string;
  phone: string;
  address: string;
  items: any[];
  total: number;
  comment?: string;
  deliveryCost: number;
}) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.log('Telegram notifications disabled - missing environment variables');
    return;
  }

  const message = `🆕 Новый заказ #${orderData.order_number}

👤 Имя: ${orderData.name}
📱 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}

🍽 Заказ:
${orderData.items.map((item: any) => {
  const additions = item.additions ? item.additions.map((add: any) => `   + ${add.name} (+${add.price}₽)`).join('\n') : '';
  return `• ${item.name} x${item.quantity || 1} - ${item.price}₽${additions ? '\n' + additions : ''}`;
}).join('\n')}

🚚 Доставка - ${orderData.deliveryCost}₽

💰 Итого: ${orderData.total}₽${orderData.comment ? `\n\n💬 Комментарий: ${orderData.comment}` : ''}`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!telegramResponse.ok) {
      console.error('Error sending Telegram notification:', await telegramResponse.text());
    } else {
      console.log('Telegram notification sent successfully');
    }
  } catch (telegramError) {
    console.error('Error sending Telegram notification:', telegramError);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received order data:', body);
    validateOrderData(body);
    const { name, phone, address, items, total, comment } = body;

    // Генерируем номер заказа
    const lastOrderNumber = getLastOrderNumber();
    const orderNumber = lastOrderNumber + 1;
    console.log('Generated order number:', orderNumber);

    // Рассчитываем стоимость доставки
    const deliveryCost = address.toLowerCase().includes('самовывоз') || items.reduce((sum: number, item: any) => {
      const itemTotal = item.price * (item.quantity || 1);
      const additionsTotal = (item.additions || []).reduce((addSum: number, add: any) => addSum + add.price, 0);
      return sum + itemTotal + additionsTotal;
    }, 0) >= 500 ? 0 : 150;
    const itemsTotal = items.reduce((sum: number, item: any) => {
      const itemTotal = item.price * (item.quantity || 1);
      const additionsTotal = (item.additions || []).reduce((addSum: number, add: any) => addSum + add.price, 0);
      return sum + itemTotal + additionsTotal;
    }, 0);
    const finalTotal = itemsTotal + deliveryCost;

    // Сохраняем заказ в базе данных
    const result = createOrder({
      order_number: orderNumber,
      name,
      phone,
      address,
      items,
      total: finalTotal,
      comment,
      status: 'new'
    });
    console.log('Order created in SQLite:', result);

    // Отправляем уведомление в Telegram
    await sendTelegramNotification({
      order_number: orderNumber,
      name,
      phone,
      address,
      items,
      total: finalTotal,
      comment,
      deliveryCost
    });

    return NextResponse.json({ success: true, order_number: orderNumber });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 