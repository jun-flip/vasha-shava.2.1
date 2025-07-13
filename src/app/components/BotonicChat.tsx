"use client";
import { useState, useRef, useEffect } from 'react';
import OrderConfirmationModal from './OrderConfirmationModal';
import { useCart } from '../context/CartContext';

function randomDelay(min = 700, max = 1200) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Step = 'greeting' | 'name' | 'phone' | 'delivery' | 'address' | 'street' | 'house' | 'apartment' | 'entrance' | 'floor' | 'pickup' | 'order' | 'comment' | 'confirm' | 'success';

interface OrderData {
  name: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: {
    street: string;
    house: string;
    apartment: string;
    entrance: string;
    floor: string;
  };
  pickupTime?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  comment: string;
}

// Helper to convert bot order items to CartItem[] for modal
function toCartItems(items: Array<{ name: string; price: number; quantity: number }>) {
  return items.map((item, idx) => ({
    id: String(idx),
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: '', // или можно подставить placeholder
    selectedAdditives: []
  }));
}

export default function BotonicChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('greeting');
  const cartContext = useCart();
  const [orderData, setOrderData] = useState<OrderData>({
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: {
      street: '',
      house: '',
      apartment: '',
      entrance: '',
      floor: ''
    },
    items: [],
    total: 0,
    comment: ''
  });
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: randomFrom([
      'Привет! 👋 Как вас зовут?',
      'Здравствуйте! Я помогу оформить заказ. Как к вам обращаться?',
      'Добро пожаловать! Напишите, пожалуйста, ваше имя 😊'
    ]), isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dishStep, setDishStep] = useState<'name' | 'quantity' | null>(null);
  const [selectedDish, setSelectedDish] = useState<{ id: number; name: string; price: number } | null>(null);
  const [dishInput, setDishInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState<OrderData | null>(null);

  // Функция для синхронизации данных бота с корзиной
  const syncBotDataWithCart = (itemsToSync?: Array<{ name: string; price: number; quantity: number }>) => {
    const itemsToUse = itemsToSync || orderData.items;
    
    console.log('BotonicChat: syncBotDataWithCart вызвана');
    console.log('BotonicChat: cartContext доступен:', !!cartContext);
    console.log('BotonicChat: itemsToUse:', itemsToUse);
    console.log('BotonicChat: itemsToUse.length:', itemsToUse.length);
    
    if (cartContext && itemsToUse.length > 0) {
      // Проверяем, есть ли уже товары в корзине
      const currentCartItems = cartContext.items || [];
      console.log('BotonicChat: текущие товары в корзине:', currentCartItems);
      
      // Очищаем корзину только если она пустая или содержит другие товары
      if (currentCartItems.length === 0) {
        console.log('BotonicChat: корзина пустая, добавляем товары');
      } else {
        console.log('BotonicChat: корзина уже содержит товары, очищаем и добавляем новые');
        cartContext.clearCart();
      }
      
      // Добавляем все блюда из бота в корзину
      itemsToUse.forEach((item, index) => {
        console.log('BotonicChat: добавляем товар в корзину:', item);
        // Добавляем товар с правильным количеством
        for (let i = 0; i < item.quantity; i++) {
          cartContext.addItem({
            id: `bot-${index}-${i}`,
            name: item.name,
            price: item.price,
            quantity: 1, // Добавляем по одному, но item.quantity раз
            image: '',
            selectedAdditives: []
          });
        }
      });
      console.log('BotonicChat: все товары добавлены в корзину');
      
      // Сохраняем корзину в localStorage
      const cartItems = itemsToUse.map((item, index) => ({
        id: `bot-${index}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: '',
        selectedAdditives: []
      }));
      console.log('BotonicChat: готовим cartItems для localStorage:', cartItems);
      console.log('BotonicChat: JSON.stringify(cartItems):', JSON.stringify(cartItems));
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log('BotonicChat: корзина сохранена в localStorage:', cartItems);
      
      // Проверяем, что данные сохранились
      const savedCart = localStorage.getItem('cart');
      console.log('BotonicChat: проверяем сохраненные данные:', savedCart);
      console.log('BotonicChat: JSON.parse(savedCart):', savedCart ? JSON.parse(savedCart) : null);
      
      // Проверяем все ключи в localStorage
      console.log('BotonicChat: все ключи в localStorage:', Object.keys(localStorage));
    } else {
      console.error('BotonicChat: cartContext недоступен или itemsToUse пустой');
      console.error('BotonicChat: cartContext:', !!cartContext);
      console.error('BotonicChat: itemsToUse.length:', itemsToUse.length);
    }
  };

  const menuItems = [
    { id: 1, name: 'Классика', price: 200 },
    { id: 2, name: 'Классика XL', price: 290 },
    { id: 3, name: 'Вегетарианская', price: 220 },
    { id: 4, name: 'Острый лаваш', price: 350 },
  ];

  // Обработчик клика вне поп-апа
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Автоматический скролл к последнему сообщению
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Добавить сообщение с задержкой и "бот печатает..."
  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), text, isBot: true }]);
    }, randomDelay());
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text, isBot: false }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');

    // Обработка по шагам
    switch (currentStep) {
      case 'greeting':
        setOrderData(prev => ({ ...prev, name: userMessage }));
        setCurrentStep('phone');
        addBotMessage(randomFrom([
          `Рада знакомству, ${userMessage}! 📞 Напишите ваш номер телефона:`,
          `Спасибо, ${userMessage}! Теперь укажите ваш номер телефона, пожалуйста.`,
          `Отлично, ${userMessage}! Какой у вас номер телефона?`
        ]));
        break;

      case 'name':
        setOrderData(prev => ({ ...prev, name: userMessage }));
        setCurrentStep('phone');
        addBotMessage('Отлично! Теперь укажите ваш номер телефона:');
        break;

      case 'phone':
        setOrderData(prev => ({ ...prev, phone: userMessage }));
        setCurrentStep('delivery');
        addBotMessage('Выберите способ получения:');
        break;

      case 'delivery':
        if (userMessage.toLowerCase().includes('доставка')) {
          setOrderData(prev => ({ ...prev, deliveryType: 'delivery' }));
          setCurrentStep('street');
          addBotMessage('Укажите улицу доставки 🏠:');
        } else if (userMessage.toLowerCase().includes('самовывоз')) {
          setOrderData(prev => ({ ...prev, deliveryType: 'pickup' }));
          setCurrentStep('pickup');
          addBotMessage('Укажите время самовывоза (например, 14:30). Время работы с 9:00 до 21:00:');
        } else {
          addBotMessage('Пожалуйста, выберите способ получения, используя кнопки ниже:');
        }
        break;

      case 'street':
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address!, street: userMessage }
        }));
        setCurrentStep('house');
        addBotMessage('Укажите номер дома:');
        break;

      case 'house':
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address!, house: userMessage }
        }));
        setCurrentStep('apartment');
        addBotMessage('Укажите номер квартиры:');
        break;

      case 'apartment':
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address!, apartment: userMessage }
        }));
        setCurrentStep('entrance');
        addBotMessage('Укажите номер подъезда:');
        break;

      case 'entrance':
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address!, entrance: userMessage }
        }));
        setCurrentStep('floor');
        addBotMessage('Укажите номер этажа:');
        break;

      case 'floor':
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address!, floor: userMessage }
        }));
        setCurrentStep('order');
        setDishStep('name');
        setDishInput('');
        addBotMessage('Отлично! Теперь выберите блюда из меню. Начните вводить название блюда.\n\n🚚 Доставка: 150₽ (бесплатно от 500₽)');
        break;
      case 'pickup': {
        // Проверка времени самовывоза
        const [hours, minutes] = userMessage.split(':').map(Number);
        const pickupTime = hours * 60 + minutes;
        const openTime = 9 * 60; // 9:00
        const closeTime = 21 * 60; // 21:00
        if (pickupTime < openTime || pickupTime > closeTime) {
          addBotMessage('Пожалуйста, выберите время самовывоза в период работы с 9:00 до 21:00:');
          return;
        }
        setOrderData(prev => ({ ...prev, pickupTime: userMessage }));
        setCurrentStep('order');
        setDishStep('name');
        setDishInput('');
        addBotMessage('Отлично! Теперь выберите блюда из меню. Начните вводить название блюда.\n\n🏪 Самовывоз - бесплатно');
        break;
      }
      case 'order': {
        if (dishStep === 'name') {
          // Пользователь выбрал блюдо по названию
          const found = menuItems.find(item => item.name.toLowerCase() === userMessage.toLowerCase());
          if (found) {
            setSelectedDish(found);
            setDishStep('quantity');
            addBotMessage(`Сколько порций блюда "${found.name}" добавить?`);
          } else {
            addBotMessage('Не могу найти такое блюдо. Начните вводить название, и выберите из подсказок.');
          }
          break;
        }
        if (dishStep === 'quantity' && selectedDish) {
          const quantity = parseInt(userMessage);
          if (!isNaN(quantity) && quantity > 0) {
            const newItem = {
              name: selectedDish.name,
              price: selectedDish.price,
              quantity: quantity
            };
            
            console.log('BotonicChat: добавляем новое блюдо:', newItem);
            console.log('BotonicChat: текущие orderData.items:', orderData.items);
            
            setOrderData(prev => {
              const updatedOrderData = {
                ...prev,
                items: [...prev.items, newItem],
                total: prev.total + (selectedDish.price * quantity)
              };
              console.log('BotonicChat: обновленные orderData:', updatedOrderData);
              return updatedOrderData;
            });
            
            // Добавляем блюдо в корзину
            if (cartContext) {
              // Добавляем блюдо с правильным количеством
              for (let i = 0; i < quantity; i++) {
                cartContext.addItem({
                  id: `bot-${Date.now()}-${i}`,
                  name: selectedDish.name,
                  price: selectedDish.price,
                  quantity: 1, // Добавляем по одному, но quantity раз
                  image: '',
                  selectedAdditives: []
                });
              }
              
              // Сохраняем обновленную корзину в localStorage
              const updatedItems = [...orderData.items, newItem];
              const cartItems = updatedItems.map((item, index) => ({
                id: `bot-${index}`,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: '',
                selectedAdditives: []
              }));
              console.log('BotonicChat: сохраняем в localStorage cartItems:', cartItems);
              console.log('BotonicChat: JSON.stringify(cartItems):', JSON.stringify(cartItems));
              localStorage.setItem('cart', JSON.stringify(cartItems));
              console.log('BotonicChat: корзина обновлена в localStorage:', cartItems);
              
              // Проверяем, что данные сохранились
              const savedCart = localStorage.getItem('cart');
              console.log('BotonicChat: проверяем сохраненные данные:', savedCart);
            }
            
            setDishStep('name');
            setSelectedDish(null);
            setDishInput('');
            setInputValue('');
            
            // Рассчитываем стоимость доставки
            const newTotal = orderData.total + (selectedDish.price * quantity);
            const deliveryCost = orderData.deliveryType === 'delivery' && newTotal < 500 ? 150 : 0;
            const finalTotal = newTotal + deliveryCost;
            
            addBotMessage(randomFrom([
              `Добавлено: ${newItem.name} x${quantity} - ${selectedDish.price * quantity}₽. 🍽️`,
              `Записал: ${newItem.name} x${quantity} (${selectedDish.price * quantity}₽).`,
              `Отличный выбор! ${newItem.name} x${quantity} — ${selectedDish.price * quantity}₽.`
            ]) + `\n\n💰 Сумма заказа: ${newTotal}₽${deliveryCost > 0 ? `\n🚚 Доставка: ${deliveryCost}₽` : ''}\n💳 Итого: ${finalTotal}₽\n\nХотите добавить еще что-нибудь в заказ? Напишите название следующего блюда или нажмите "Завершить заказ".`);
          } else {
            addBotMessage('Пожалуйста, укажите корректное количество порций (целое число больше 0).');
          }
          break;
        }
        if (userMessage.toLowerCase() === 'готово') {
          setCurrentStep('comment');
          setDishStep(null);
          setSelectedDish(null);
          setDishInput('');
          addBotMessage('Хотите добавить комментарий к заказу? (например, "не звонить в дверь" или "оставить у консьержа"). Если комментарий не нужен, напишите "нет":');
          return;
        }
        // Если не попали ни в один из кейсов — просим выбрать блюдо
        addBotMessage('Пожалуйста, выберите блюдо из меню. Начните вводить название и выберите из подсказок.');
        break;
      }
      case 'comment': {
        setOrderData(prev => ({ ...prev, comment: userMessage.trim() }));
        setInputValue('');
        setIsTyping(false);
        setCurrentStep('confirm');
        handleConfirmOrder(userMessage.trim());
        break;
      }
    }
  };

  const handleConfirmOrder = async (comment?: string) => {
    setCurrentStep('confirm');
    const deliveryText = orderData.deliveryType === 'delivery' 
      ? `Адрес: ${orderData.address?.street}, д. ${orderData.address?.house}, кв. ${orderData.address?.apartment}, подъезд ${orderData.address?.entrance}, этаж ${orderData.address?.floor}`
      : `Самовывоз в ${orderData.pickupTime}`;
    const deliveryCost = orderData.deliveryType === 'delivery' && orderData.total < 500 ? 150 : 0;
    const finalTotal = orderData.total + deliveryCost;
    addBotMessage(`Подтвердите заказ:\n\n👤 Имя: ${orderData.name}\n📱 Телефон: ${orderData.phone}\n📍 ${deliveryText}\n\n🍽 Заказ:\n${orderData.items.map(item => `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₽`).join('\n')}\n\n🚚 Доставка: ${deliveryCost}₽\n💰 Итого: ${finalTotal}₽${comment ? `\n\n💬 Комментарий: ${comment}` : orderData.comment ? `\n\n💬 Комментарий: ${orderData.comment}` : ''}\n\nНапишите "да" для подтверждения или "нет" для отмены.`);
  };

  const handleFinalConfirm = async () => {
    if (inputValue.toLowerCase().includes('да')) {
      setCurrentStep('success');
      addBotMessage(randomFrom([
        '✅ Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для подтверждения. Спасибо за заказ! 🥳',
        'Ваш заказ принят! Спасибо, что выбрали нас! 🚀',
        'Заказ оформлен! Ожидайте звонка для подтверждения. Приятного аппетита! 😋'
      ]));
      try {
        const deliveryText = orderData.deliveryType === 'delivery' 
          ? `${orderData.address?.street}, д. ${orderData.address?.house}, кв. ${orderData.address?.apartment}, подъезд ${orderData.address?.entrance}, этаж ${orderData.address?.floor}`
          : `Самовывоз в ${orderData.pickupTime}`;
        const deliveryCost = orderData.deliveryType === 'delivery' && orderData.total < 500 ? 150 : 0;
        const finalTotal = orderData.total + deliveryCost;
        const orderPayload = {
          name: orderData.name,
          phone: orderData.phone,
          address: deliveryText,
          items: orderData.items,
          total: finalTotal,
          comment: orderData.comment || 'Заказ через чат-бот'
        };
        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } catch (error) {
        addBotMessage('❌ Произошла ошибка при оформлении заказа. Попробуйте позже или оформите заказ через сайт.');
      }
    } else if (inputValue.toLowerCase().includes('нет')) {
      addBotMessage(randomFrom([
        'Заказ отменен. Можете начать заново или оформить заказ через сайт.',
        'Понял, заказ отменён. Если передумаете — я всегда на связи!'
      ]));
      setCurrentStep('greeting');
      setOrderData({ 
        name: '', 
        phone: '', 
        deliveryType: 'delivery', 
        address: { street: '', house: '', apartment: '', entrance: '', floor: '' },
        items: [], 
        total: 0,
        comment: ''
      });
    } else {
      addBotMessage('Пожалуйста, напишите "да" для подтверждения или "нет" для отмены.');
    }
    setInputValue('');
  };

  const handleInputSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentStep === 'confirm') {
        handleFinalConfirm();
      } else {
        handleSend();
      }
    }
  };

  // Функция для обработки выбора способа доставки через кнопки
  const handleDeliveryChoice = (choice: 'delivery' | 'pickup') => {
    if (choice === 'delivery') {
      setOrderData(prev => ({ ...prev, deliveryType: 'delivery' }));
      setCurrentStep('street');
      addBotMessage('Укажите улицу доставки 🏠:');
    } else {
      setOrderData(prev => ({ ...prev, deliveryType: 'pickup' }));
      setCurrentStep('pickup');
      addBotMessage('Укажите время самовывоза (например, 14:30). Время работы с 9:00 до 21:00:');
    }
  };

  // Для автодополнения блюд
  const filteredDishes = dishStep === 'name' && dishInput
    ? menuItems.filter(item => item.name.toLowerCase().includes(dishInput.toLowerCase()))
    : [];

  const isOrderReady =
    orderData.name &&
    orderData.phone &&
    (
      (orderData.deliveryType === 'delivery' &&
        orderData.address?.street &&
        orderData.address?.house &&
        orderData.address?.apartment &&
        orderData.address?.entrance &&
        orderData.address?.floor
      ) ||
      (orderData.deliveryType === 'pickup' && orderData.pickupTime)
    );

  useEffect(() => {
    // Expose a global function to open the chat from anywhere
    (window as any).openVashaShavaChat = () => setIsOpen(true);
    return () => {
      if ((window as any).openVashaShavaChat) {
        delete (window as any).openVashaShavaChat;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {/* Кнопка чата - скрывается когда открыт поп-ап */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#8fc52f] text-white rounded-full shadow-lg hover:bg-[#7db02a] transition-colors flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 max-w-[95vw] sm:w-80 h-96 max-h-[90vh] bg-white rounded-lg shadow-xl border flex flex-col">
          {/* Заголовок */}
          <div className="bg-[#8fc52f] text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Лавашик</h3>
          </div>

          {/* Сообщения */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 flex-1">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg whitespace-pre-line ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-[#8fc52f] text-white'
                  }`}
                >
                  {message.text}
                  {/* Кнопки выбора способа доставки */}
                  {message.isBot && currentStep === 'delivery' && message.text === 'Выберите способ получения:' && (
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => handleDeliveryChoice('delivery')}
                        className="w-full px-4 py-2 bg-[#8fc52f] text-white rounded-lg hover:bg-[#7db02a] transition-colors text-sm font-medium"
                      >
                        🚚 Доставка
                      </button>
                      <button
                        onClick={() => handleDeliveryChoice('pickup')}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        🏪 Самовывоз
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-200 text-gray-500 animate-pulse">
                  Бот печатает<span className="animate-bounce">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={dishStep === 'name' ? dishInput : inputValue}
                onChange={(e) => {
                  if (dishStep === 'name') setDishInput(e.target.value);
                  else setInputValue(e.target.value);
                }}
                onKeyPress={handleInputSubmit}
                placeholder={dishStep === 'name' ? 'Начните вводить название блюда...' : 'Введите сообщение...'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8fc52f] text-black"
                disabled={isTyping}
              />
              <button
                onClick={currentStep === 'confirm' ? handleFinalConfirm : handleSend}
                className="px-4 py-2 bg-[#8fc52f] text-white rounded-lg hover:bg-[#7db02a] transition-colors flex items-center justify-center"
                disabled={isTyping}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            {/* Подсказки по блюдам */}
            {dishStep === 'name' && filteredDishes.length > 0 && (
              <div className="mt-2 bg-white border rounded shadow max-h-32 overflow-y-auto">
                {filteredDishes.map(dish => (
                  <div
                    key={dish.id}
                    className="px-4 py-2 cursor-pointer hover:bg-[#f3f4f6] flex justify-between items-center"
                    onClick={() => {
                      setDishInput(dish.name);
                      setTimeout(() => {
                        setInputValue(dish.name);
                        setTimeout(() => handleSend(), 100);
                      }, 50);
                    }}
                  >
                    <span className="font-semibold text-black">{dish.name}</span>
                    <span className="ml-2 text-gray-500 whitespace-nowrap">{dish.price}₽</span>
                  </div>
                ))}
              </div>
            )}
            {/* Универсальное модальное окно подтверждения заказа */}
            <OrderConfirmationModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              items={toCartItems(orderData.items)}
              total={orderData.total}
              name={orderData.name}
              phone={orderData.phone}
              address={orderData.deliveryType === 'delivery'
                ? `${orderData.address?.street}, д. ${orderData.address?.house}, кв. ${orderData.address?.apartment}, подъезд ${orderData.address?.entrance}, этаж ${orderData.address?.floor}`
                : `Самовывоз в ${orderData.pickupTime}`}
              comment={orderData.comment}
              fromBot={true}
            />
            {/* Кнопка "Завершить заказ" на этапе подтверждения */}
            {currentStep === 'confirm' && (
              <button
                onClick={handleFinalConfirm}
                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={isTyping}
              >
                Подтвердить заказ
              </button>
            )}
            {/* Кнопка "Завершить заказ" на этапе выбора блюд */}
            {currentStep === 'order' && orderData.items.length > 0 && (
              <button
                onClick={() => {
                  console.log('BotonicChat: кнопка "Завершить заказ" нажата');
                  console.log('BotonicChat: current orderData before save', orderData);
                  console.log('BotonicChat: orderData.items.length:', orderData.items.length);
                  console.log('BotonicChat: orderData.items:', orderData.items);
                  
                  // Сохраняем данные корзины в localStorage без очистки
                  const cartItems = orderData.items.map((item, index) => ({
                    id: `bot-${index}`,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: '',
                    selectedAdditives: []
                  }));
                  console.log('BotonicChat: сохраняем cartItems в localStorage:', cartItems);
                  console.log('BotonicChat: JSON.stringify(cartItems):', JSON.stringify(cartItems));
                  localStorage.setItem('cart', JSON.stringify(cartItems));
                  console.log('BotonicChat: корзина сохранена в localStorage');
                  
                  // Проверяем, что данные сохранились
                  const savedCart = localStorage.getItem('cart');
                  console.log('BotonicChat: проверяем сохраненные данные:', savedCart);
                  
                  const formData = {
                    name: orderData.name,
                    phone: orderData.phone,
                    address: {
                      street: orderData.address?.street || '',
                      house: orderData.address?.house || '',
                      apartment: orderData.address?.apartment || '',
                      entrance: orderData.address?.entrance || '',
                      floor: orderData.address?.floor || ''
                    },
                    comment: orderData.comment,
                    isPickup: orderData.deliveryType === 'pickup',
                    pickupTime: orderData.pickupTime || ''
                  };
                  console.log('BotonicChat: saving checkout_form_data', formData);
                  const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
                  localStorage.setItem('checkout_form_data', JSON.stringify({ data: formData, expiry }));
                  
                  // Проверяем, что корзина сохранилась
                  const finalSavedCart = localStorage.getItem('cart');
                  console.log('BotonicChat: финальная проверка корзины в localStorage:', finalSavedCart);
                  
                  console.log('BotonicChat: переход на checkout через 200ms');
                  setTimeout(() => {
                    window.location.href = '/checkout';
                  }, 200);
                }}
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!isOrderReady || isTyping}
              >
                {(() => {
                  const deliveryCost = orderData.deliveryType === 'delivery' && orderData.total < 500 ? 150 : 0;
                  const finalTotal = orderData.total + deliveryCost;
                  return `Завершить заказ (${finalTotal}₽)`;
                })()}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 