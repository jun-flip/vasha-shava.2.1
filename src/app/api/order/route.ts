import { NextResponse } from 'next/server';
import { supabase, initializeCounters } from '@/lib/supabase';

const DELIVERY_COST = 200; // Стоимость доставки

export async function POST(request: Request) {
  try {
    console.log('Начало обработки заказа');
    console.log('Environment variables:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '***' : 'missing',
      SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'missing',
      TELEGRAM_BOT: process.env.TELEGRAM_BOT_TOKEN ? '***' : 'missing',
      TELEGRAM_CHAT: process.env.TELEGRAM_CHAT_ID ? '***' : 'missing'
    });

    // Инициализируем счетчики
    await initializeCounters();

    const orderData = await request.json();
    console.log('Получены данные заказа:', JSON.stringify(orderData, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      console.log('Отсутствуют обязательные поля:', missingFields);
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
      console.log('Неверный формат телефона:', orderData.phone);
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
    console.log('Получение счетчика заказов...');
    const { data: counter, error: counterError } = await supabase
      .from('counters')
      .select('seq')
      .eq('id', 'orderCounter')
      .single();

    console.log('Результат получения счетчика:', { counter, counterError });

    if (counterError) {
      console.error('Ошибка при получении счетчика:', counterError);
      if (counterError.code === 'PGRST116') {
        console.log('Счетчик не найден, создаем новый...');
      } else {
        throw counterError;
      }
    }

    let orderNumber;
    if (!counter) {
      console.log('Создание нового счетчика...');
      // Если счетчика нет, создаем его
      const { data: newCounter, error: insertError } = await supabase
        .from('counters')
        .insert([{ id: 'orderCounter', seq: 1 }])
        .select()
        .single();
      
      if (insertError) {
        console.error('Ошибка при создании счетчика:', insertError);
        throw insertError;
      }
      console.log('Создан новый счетчик:', newCounter);
      orderNumber = '0001';
    } else {
      console.log('Инкремент существующего счетчика...');
      // Инкрементируем счетчик
      const { data: updatedCounter, error: updateError } = await supabase
        .from('counters')
        .update({ seq: counter.seq + 1 })
        .eq('id', 'orderCounter')
        .select()
        .single();

      if (updateError) {
        console.error('Ошибка при обновлении счетчика:', updateError);
        throw updateError;
      }
      console.log('Обновленный счетчик:', updatedCounter);
      orderNumber = updatedCounter.seq.toString().padStart(4, '0');
    }

    console.log('Сформированный номер заказа:', orderNumber);

    // Добавляем стоимость доставки к общей сумме
    const totalWithDelivery = orderData.totalPrice + DELIVERY_COST;

    console.log('Сохранение заказа в базу данных...');
    // Сохраняем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        order_number: `#${orderNumber}`,
        total_price: totalWithDelivery,
        delivery_cost: DELIVERY_COST,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Ошибка при сохранении заказа:', orderError);
      throw orderError;
    }

    console.log('Заказ успешно сохранен:', order);

    // Формируем сообщение для Telegram
    const message = `
🆕 Новый заказ ${order.order_number}

👤 Имя: ${orderData.name}
📞 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}
${orderData.comment ? `💬 Комментарий: ${orderData.comment}` : ''}

🛒 Заказ:
${orderData.items.map((item: any) => 
  `• ${item.name} x${item.quantity || 1} - ${item.price * (item.quantity || 1)} ₽`
).join('\n')}

🚚 Доставка: ${DELIVERY_COST} ₽
💰 Итого: ${totalWithDelivery} ₽
💳 Способ оплаты: ${orderData.paymentMethod}
`;

    console.log('Отправка уведомления в Telegram...');
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Отсутствуют переменные окружения для Telegram');
      throw new Error('Missing Telegram environment variables');
    }

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
      const errorText = await telegramResponse.text();
      console.error('Ошибка при отправке в Telegram:', errorText);
      throw new Error(`Failed to send Telegram notification: ${errorText}`);
    }

    console.log('Уведомление в Telegram успешно отправлено');

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number,
      totalWithDelivery
    });
  } catch (error) {
    console.error('Критическая ошибка при создании заказа:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 