import { NextResponse } from 'next/server';
import { CartItem } from '../../../types';

interface OrderData {
  name: string;
  phone: string;
  time: string;
  comment?: string;
  items: CartItem[];
  total: number;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function validateOrderData(data: any): data is OrderData {
  return (
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    typeof data.phone === 'string' &&
    typeof data.time === 'string' &&
    Array.isArray(data.items) &&
    typeof data.total === 'number' &&
    data.items.every((item: any) => 
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.price === 'number'
    )
  );
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration is missing');
    }

    if (!validateOrderData(orderData)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order data' },
        { status: 400 }
      );
    }

    // Формируем сообщение для Telegram
    const message = `
🆕 Новый заказ!

👤 Имя: ${orderData.name}
📱 Телефон: ${orderData.phone}
⏰ Время приготовления: ${orderData.time}
${orderData.comment ? `📝 Комментарий: ${orderData.comment}` : ''}

💰 Сумма заказа: ${orderData.total} ₽

🍽️ Состав заказа:
${orderData.items.map((item) => 
`- ${item.name} x${item.quantity || 1} (${item.price} ₽)${item.selectedAdditives && item.selectedAdditives.length > 0 ? 
`
` + item.selectedAdditives.map((additive) => `  + ${additive.name} (+${additive.price} ₽)`).join('\n') : ''}`).join('\n')}
    `.trim();

    // Отправляем сообщение в Telegram
    const response = await fetch(
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

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order to Telegram' },
      { status: 500 }
    );
  }
} 