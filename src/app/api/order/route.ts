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
    console.log('Комментарий к заказу:', orderData.comment);

    // Получаем и обновляем счетчик заказов в одной транзакции
    console.log('Обновление счетчика заказов...');
    const { data: updatedCounter, error: counterError } = await supabase
      .rpc('increment_order_counter')
      .select()
      .single();

    if (counterError) {
      console.error('Ошибка при обновлении счетчика:', counterError);
      throw counterError;
    }

    console.log('Обновленный счетчик:', updatedCounter);
    const orderNumber = updatedCounter.seq.toString().padStart(4, '0');
    console.log('Сформированный номер заказа:', orderNumber);

    // Рассчитываем общую сумму заказа
    const itemsTotal = orderData.items.reduce((sum: number, item: any) => {
      const itemTotal = item.price * (item.quantity || 1);
      const additionsTotal = (item.additions || []).reduce((addSum: number, add: any) => addSum + (add.price || 0), 0);
      return sum + itemTotal + additionsTotal;
    }, 0);

    // Добавляем стоимость доставки к общей сумме
    const totalWithDelivery = itemsTotal + DELIVERY_COST;

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
📱 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}
${orderData.comment ? `\n💬 Комментарий к заказу:\n${orderData.comment}` : ''}

🍽 Заказ:
${orderData.items.map((item: any) => {
  const itemTotal = item.price * (item.quantity || 1);
  const additions = (item.additions || []).map((add: any) => `   + ${add.name} (+${add.price}₽)`).join('\n');
  return `• ${item.name} x${item.quantity || 1} - ${itemTotal}₽${additions ? '\n' + additions : ''}`;
}).join('\n')}
• Доставка - ${DELIVERY_COST}₽

💰 Сумма заказа: ${itemsTotal}₽
🚚 Доставка: ${DELIVERY_COST}₽
💵 Итого к оплате: ${totalWithDelivery}₽
`;

    console.log('Отправка уведомления в Telegram...');
    console.log('Текст сообщения:', message);

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