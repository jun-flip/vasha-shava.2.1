import { NextResponse } from 'next/server';

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

    // Здесь в реальном приложении была бы логика сохранения в базу данных
    // и, возможно, отправка уведомлений

    return NextResponse.json(
      { 
        message: 'Заказ успешно получен!', 
        success: true,
        orderId: Date.now().toString() // Temporary order ID
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
        message: 'Internal server error', 
        success: false 
      }, 
      { status: 500 }
    );
  }
} 