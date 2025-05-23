import { Promotion } from '../types';

export const promotions: Promotion[] = [
  {
    id: 1,
    code: 'WELCOME10',
    description: 'Скидка 10% на первый заказ',
    discount: 10,
    type: 'percentage',
    minOrderAmount: 500,
    validUntil: '2024-12-31',
    isActive: true
  },
  {
    id: 2,
    code: 'COMBO20',
    description: 'Скидка 20% на комбо-наборы',
    discount: 20,
    type: 'percentage',
    validUntil: '2024-06-30',
    isActive: true
  },
  {
    id: 3,
    code: 'FREESAUCE',
    description: 'Бесплатный соус к любому заказу',
    discount: 50,
    type: 'fixed',
    validUntil: '2024-05-31',
    isActive: true
  }
]; 