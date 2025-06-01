import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, items, total, comment } = body;

    // Get next order number
    const { data: orderNumber, error: orderNumberError } = await supabase
      .rpc('get_next_order_number');

    if (orderNumberError) {
      console.error('Error getting order number:', orderNumberError);
      return NextResponse.json(
        { error: 'Failed to generate order number' },
        { status: 500 }
      );
    }

    // Calculate total with delivery
    const deliveryCost = 200;
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
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

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

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 