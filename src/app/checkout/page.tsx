'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

interface Address {
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;
}

interface FormData {
  name: string;
  phone: string;
  address: Address;
  comment: string;
  isPickup: boolean;
  pickupTime: string;
}

const STORAGE_KEY = 'checkout_form_data';
const EXPIRY_DAYS = 30;

export default function Checkout() {
  const router = useRouter();
  const { clearCart, items, total, addItem } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: {
      street: '',
      house: '',
      apartment: '',
      entrance: '',
      floor: ''
    },
    comment: '',
    isPickup: false,
    pickupTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка сохраненных данных при монтировании компонента и при фокусе окна
  useEffect(() => {
    const loadSavedData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const { data, expiry } = JSON.parse(savedData);
          console.log('Checkout: данные из localStorage', data);
          if (new Date().getTime() < expiry) {
            setFormData(data);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Ошибка при загрузке сохраненных данных:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        console.log('Checkout: localStorage пуст');
      }
      setIsInitialized(true);
    };
    loadSavedData();
    window.addEventListener('focus', loadSavedData);
    return () => {
      window.removeEventListener('focus', loadSavedData);
    };
  }, []);

  // Синхронизация данных из localStorage с корзиной, если корзина пустая
  useEffect(() => {
    console.log('Checkout: useEffect для синхронизации корзины вызван');
    console.log('Checkout: isInitialized:', isInitialized);
    console.log('Checkout: items.length:', items.length);
    console.log('Checkout: текущие товары в корзине:', items);
    
    // Не загружаем данные из localStorage, если в корзине уже есть товары
    if (isInitialized && items.length === 0) {
      const savedCart = localStorage.getItem('cart');
      console.log('Checkout: проверяем localStorage cart:', savedCart);
      
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          console.log('Checkout: загружаем корзину из localStorage', cartItems);
          console.log('Checkout: тип cartItems:', typeof cartItems);
          console.log('Checkout: Array.isArray(cartItems):', Array.isArray(cartItems));
          console.log('Checkout: cartItems.length:', cartItems?.length);
          
          if (Array.isArray(cartItems) && cartItems.length > 0) {
            console.log('Checkout: начинаем добавлять товары в корзину');
            cartItems.forEach((item, index) => {
              console.log('Checkout: добавляем товар в корзину:', item);
              // Добавляем товар с правильным количеством
              for (let i = 0; i < (item.quantity || 1); i++) {
                addItem({
                  id: item.id || `restored-${Date.now()}-${Math.random()}`,
                  name: item.name,
                  price: item.price,
                  quantity: 1, // Добавляем по одному, но item.quantity раз
                  image: item.image || '',
                  selectedAdditives: item.selectedAdditives || []
                });
              }
            });
            console.log('Checkout: все товары добавлены в корзину');
          } else {
            console.log('Checkout: корзина в localStorage пустая или некорректная');
            console.log('Checkout: cartItems:', cartItems);
            console.log('Checkout: typeof cartItems:', typeof cartItems);
            console.log('Checkout: cartItems === null:', cartItems === null);
            console.log('Checkout: cartItems === undefined:', cartItems === undefined);
            
            // Попробуем найти данные в checkout_form_data
            const savedFormData = localStorage.getItem('checkout_form_data');
            console.log('Checkout: проверяем checkout_form_data:', savedFormData);
            if (savedFormData) {
              try {
                const { data, expiry } = JSON.parse(savedFormData);
                console.log('Checkout: данные checkout_form_data:', data);
                console.log('Checkout: expiry:', expiry);
                console.log('Checkout: текущее время:', new Date().getTime());
                if (new Date().getTime() < expiry && data.fromBot) {
                  console.log('Checkout: найдены данные от бота, но корзина пустая');
                  // Здесь можно попробовать восстановить данные из других источников
                }
              } catch (error) {
                console.error('Ошибка при парсинге checkout_form_data:', error);
              }
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке корзины из localStorage:', error);
        }
      } else {
        console.log('Checkout: корзина в localStorage не найдена');
        
        // Проверяем все ключи в localStorage
        console.log('Checkout: все ключи в localStorage:', Object.keys(localStorage));
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            console.log(`Checkout: localStorage[${key}]:`, localStorage.getItem(key));
          }
        }
      }
    } else if (isInitialized && items.length > 0) {
      console.log('Checkout: корзина уже содержит товары, не загружаем из localStorage');
      console.log('Checkout: текущие товары в корзине:', items);
    }
  }, [isInitialized, items.length, addItem]);

  // Сохранение данных при изменении формы, только после инициализации
  useEffect(() => {
    if (!isInitialized) return;
    const expiry = new Date().getTime() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const dataToSave = {
      data: formData,
      expiry
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Проверяем, что корзина не пустая
      if (items.length === 0) {
        alert('Корзина пуста. Пожалуйста, добавьте товары в корзину перед оформлением заказа.');
        setIsSubmitting(false);
        return;
      }

      // Проверяем, что общая сумма больше 0
      if (total <= 0) {
        alert('Сумма заказа должна быть больше 0.');
        setIsSubmitting(false);
        return;
      }

      // Проверка времени самовывоза
      if (formData.isPickup) {
        const [hours, minutes] = formData.pickupTime.split(':').map(Number);
        const pickupTime = hours * 60 + minutes;
        const openTime = 9 * 60; // 9:00
        const closeTime = 21 * 60; // 21:00

        if (pickupTime < openTime || pickupTime > closeTime) {
          alert('Пожалуйста, выберите время самовывоза в период работы с 9:00 до 21:00');
          setIsSubmitting(false);
          return;
        }
      }

      // Форматируем адрес или время самовывоза для отправки
      const formattedAddress = formData.isPickup 
        ? `Самовывоз в ${formData.pickupTime}`
        : `${formData.address.street}, д. ${formData.address.house}, кв. ${formData.address.apartment}, подъезд ${formData.address.entrance}, этаж ${formData.address.floor}`;

      // Логируем данные перед отправкой
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        address: formattedAddress,
        comment: formData.comment,
        items: items,
        total: total
      };
      console.log('Отправляемые данные заказа:', orderData);
      console.log('Корзина:', items);
      console.log('Общая сумма:', total);

      // Отправляем заказ
      const orderResponse = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        console.error('Ошибка API:', errorData);
        throw new Error(`HTTP error! status: ${orderResponse.status} - ${errorData.error || 'Unknown error'}`);
      }

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      // Очищаем корзину и сохраненные данные формы
      clearCart();
      localStorage.removeItem(STORAGE_KEY);
      router.push('/success');
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      alert(`Произошла ошибка при оформлении заказа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  const handleClose = () => {
    router.push('/menu');
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl w-full mx-auto relative px-2 sm:px-0">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 bg-[#8fc52f] text-white px-4 py-2 rounded-lg hover:bg-[#7db02a] transition-colors"
        >
          В меню
        </button>

        <h1 className="text-3xl font-bold mb-8 text-white text-center">Оформление заказа</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPickup"
              name="isPickup"
              checked={formData.isPickup}
              onChange={handleChange}
              className="h-4 w-4 text-[#8fc52f] focus:ring-[#8fc52f] border-gray-300 rounded"
            />
            <label htmlFor="isPickup" className="ml-2 block text-sm text-gray-900">
              Заберу сам
            </label>
          </div>

          {formData.isPickup ? (
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-900 mb-1">
                Время самовывоза
              </label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                min="09:00"
                max="21:00"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8fc52f] focus:border-[#8fc52f] outline-none text-black"
              />
              <p className="mt-1 text-sm text-gray-500">
                Время работы: с 9:00 до 21:00
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label 
                  htmlFor="address.street" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Улица
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  autoComplete="street-address"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
                  placeholder="Введите улицу"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label 
                    htmlFor="address.house" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Дом
                  </label>
                  <input
                    type="text"
                    id="address.house"
                    name="address.house"
                    autoComplete="address-line2"
                    value={formData.address.house}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
                    placeholder="Номер дома"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="address.apartment" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Квартира
                  </label>
                  <input
                    type="text"
                    id="address.apartment"
                    name="address.apartment"
                    autoComplete="address-line3"
                    value={formData.address.apartment}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
                    placeholder="Номер квартиры"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label 
                    htmlFor="address.entrance" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Подъезд
                  </label>
                  <input
                    type="text"
                    id="address.entrance"
                    name="address.entrance"
                    autoComplete="address-line4"
                    value={formData.address.entrance}
              onChange={handleChange}
              required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
                    placeholder="Номер подъезда"
            />
          </div>

          <div>
                  <label 
                    htmlFor="address.floor" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Этаж
                  </label>
                  <input
                    type="text"
                    id="address.floor"
                    name="address.floor"
                    autoComplete="address-level4"
                    value={formData.address.floor}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
                    placeholder="Номер этажа"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label 
              htmlFor="comment" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Комментарий к заказу
            </label>
            <textarea
              id="comment"
              name="comment"
              autoComplete="off"
              value={formData.comment}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082] text-black"
              placeholder="Дополнительная информация для курьера"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#8fc52f] hover:bg-[#7db02a]'
            }`}
          >
            {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
          </button>
        </form>
      </div>
    </main>
  );
} 