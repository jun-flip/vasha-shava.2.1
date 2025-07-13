import { NextResponse } from 'next/server';
import {
  createOrder,
  initializeDatabase
} from '@/lib/database';

// Проверка наличия необходимых переменных окружения для Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is not defined - Telegram notifications will be disabled');
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

// Получить последний номер заказа из Telegram
async function getLastOrderNumberFromTelegram() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return 0;
  }
  const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const res = await fetch(updatesUrl);
  const data = await res.json();
  let lastOrderNumber = 0;
  if (data.result) {
    for (let i = data.result.length - 1; i >= 0; i--) {
      const msg = data.result[i].message;
      if (
        msg &&
        msg.chat &&
        String(msg.chat.id) === String(TELEGRAM_CHAT_ID) &&
        msg.text &&
        msg.text.includes('🆕 Новый заказ #')
      ) {
        const match = msg.text.match(/#(\d+)/);
        if (match) {
          lastOrderNumber = parseInt(match[1], 10);
          break;
        }
      }
    }
  }
  return lastOrderNumber;
}

// Если chat_id не указан — отправить сообщение с chat_id и инструкцией
async function trySendChatIdInstruction() {
  if (!TELEGRAM_BOT_TOKEN) return;
  // Получаем последние апдейты
  const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const res = await fetch(updatesUrl);
  const data = await res.json();
  if (data.result) {
    for (let i = data.result.length - 1; i >= 0; i--) {
      const msg = data.result[i].message;
      if (msg && msg.chat && msg.chat.id && msg.text) {
        // Отправим в этот чат инструкцию
        const chatId = msg.chat.id;
        const text = `Ваш chat_id: ${chatId}\nДобавьте его в .env.local как TELEGRAM_CHAT_ID=...\n\nЭто нужно для корректной работы счётчика заказов.`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text })
        });
        break;
      }
    }
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
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return;
  }
  const message = `🆕 Новый заказ #${orderData.order_number}\n\n👤 Имя: ${orderData.name}\n📱 Телефон: ${orderData.phone}\n📍 Адрес: ${orderData.address}\n\n🍽 Заказ:\n${orderData.items.map((item: any) => {
    const additions = item.additions ? item.additions.map((add: any) => `   + ${add.name} (+${add.price}₽)`).join('\n') : '';
    return `• ${item.name} x${item.quantity || 1} - ${item.price}₽${additions ? '\n' + additions : ''}`;
  }).join('\n')}\n\n🚚 Доставка - ${orderData.deliveryCost}₽\n\n💰 Итого: ${orderData.total}₽${orderData.comment ? `\n\n💬 Комментарий: ${orderData.comment}` : ''}`;
  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
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

    // Получаем номер заказа из Telegram
    let orderNumber = 1;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      orderNumber = (await getLastOrderNumberFromTelegram()) + 1;
    } else {
      await trySendChatIdInstruction();
    }

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