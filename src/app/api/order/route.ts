import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Проверка наличия необходимых переменных окружения
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
}
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}
if (!process.env.TELEGRAM_CHAT_ID) {
  throw new Error('TELEGRAM_CHAT_ID is not defined');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

// Функция для генерации номера заказа
async function generateOrderNumber(): Promise<number> {
  const { data: lastOrder, error } = await supabase
    .from('orders')
    .select('order_number')
    .order('order_number', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 - no rows returned
    console.error('Error getting last order number:', error);
    throw new Error('Failed to generate order number');
  }

  return lastOrder ? lastOrder.order_number + 1 : 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received order data:', body);
    
    // Валидация данных
    validateOrderData(body);
    
    const { name, phone, address, items, total, comment } = body;

    // Generate order number
    const orderNumber = await generateOrderNumber();
    console.log('Generated order number:', orderNumber);

    // Calculate total with delivery
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

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          name,
          phone,
          address,
          items,
          total: finalTotal,
          comment,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', order);

    // Send notification to Telegram
    const message = `🆕 Новый заказ #${orderNumber}

👤 Имя: ${name}
📱 Телефон: ${phone}
📍 Адрес: ${address}

🍽 Заказ:
${items.map((item: any) => {
  const additions = item.additions ? item.additions.map((add: any) => `   + ${add.name} (+${add.price}₽)`).join('\n') : '';
  return `• ${item.name} x${item.quantity || 1} - ${item.price}₽${additions ? '\n' + additions : ''}`;
}).join('\n')}

🚚 Доставка - ${deliveryCost}₽

💰 Итого: ${finalTotal}₽${comment ? `\n\n💬 Комментарий: ${comment}` : ''}`;

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
      }
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
      // Не возвращаем ошибку, так как это не критично для создания заказа
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 