import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: `Missing required fields: ${missingFields.join(', ')}`, 
          success: false 
        }, 
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    if (!phoneRegex.test(orderData.phone)) {
      return NextResponse.json(
        { 
          message: 'Invalid phone number format', 
          success: false 
        }, 
        { status: 400 }
      );
    }

    console.log('Получен новый заказ:', orderData);

    // Получаем текущий счетчик заказов
    const { data: counter, error: counterError } = await supabase
      .from('counters')
      .select('seq')
      .eq('id', 'orderCounter')
      .single();

    if (counterError && counterError.code !== 'PGRST116') {
      throw counterError;
    }

    let orderNumber;
    if (!counter) {
      // Если счетчика нет, создаем его
      const { error: insertError } = await supabase
        .from('counters')
        .insert([{ id: 'orderCounter', seq: 1 }]);
      
      if (insertError) throw insertError;
      orderNumber = '0001';
    } else {
      // Инкрементируем счетчик
      const { data: updatedCounter, error: updateError } = await supabase
        .from('counters')
        .update({ seq: counter.seq + 1 })
        .eq('id', 'orderCounter')
        .select()
        .single();

      if (updateError) throw updateError;
      orderNumber = updatedCounter.seq.toString().padStart(4, '0');
    }

    // Сохраняем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        order_number: `#${orderNumber}`,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Формируем сообщение для Telegram
    const message = `
🆕 Новый заказ ${order.order_number}

👤 Имя: ${orderData.name}
📞 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}

🛒 Заказ:
${orderData.items.map((item: any) => 
  `• ${item.name} x${item.quantity || 1} - ${item.price * (item.quantity || 1)} ₽`
).join('\n')}

💰 Итого: ${orderData.totalPrice} ₽
💳 Способ оплаты: ${orderData.paymentMethod}
`;

    // Отправляем уведомление в Telegram
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
      throw new Error('Failed to send Telegram notification');
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 