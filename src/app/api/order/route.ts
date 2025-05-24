import { NextResponse } from 'next/server';
import { OrderFormData } from '@/types';

const TELEGRAM_BOT_TOKEN = '7955773373:AAEKm-UWGKW5WDZCGDcjpzYhedFXN6cO7QE';
const TELEGRAM_CHAT_ID = '-4884817347'; // Новый ID группы

async function sendToTelegram(orderData: OrderFormData) {
  const message = `
🆕 Новый заказ!

👤 Клиент: ${orderData.name}
📱 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}

🛒 Заказ:
${orderData.items.map(item => `- ${item.name} x${item.quantity} = ${item.price * item.quantity}₽`).join('\n')}

💰 Итого: ${orderData.totalAmount}₽
`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.description || 'Failed to send message to Telegram');
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const orderData: OrderFormData = await request.json();
    
    // Validate required fields
    if (!orderData.name || !orderData.phone || !orderData.address || !orderData.items) {
      return NextResponse.json(
        { 
          message: 'Missing required fields', 
          success: false 
        }, 
        { status: 400 }
      );
    }

    // Validate phone number format (более лояльная проверка)
    const phoneDigits = orderData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { 
          message: 'Некорректный номер телефона', 
          success: false 
        }, 
        { status: 400 }
      );
    }

    // Send order to Telegram
    await sendToTelegram(orderData);

    return NextResponse.json(
      { 
        message: 'Заказ успешно отправлен!', 
        success: true,
        orderId: Date.now().toString()
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обработке заказа:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          message: 'Invalid JSON data', 
          success: false 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Internal server error', 
        success: false 
      }, 
      { status: 500 }
    );
  }
} 