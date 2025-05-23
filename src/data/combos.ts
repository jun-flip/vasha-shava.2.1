import { Combo } from '../types';
import { menuItems } from './menu';

export const combos: Combo[] = [
  {
    id: 1,
    name: 'Комбо "Классика"',
    description: 'Классическая шаурма + картофель фри + напиток',
    price: 450,
    image: '/combos/classic.jpg',
    items: [menuItems[0], menuItems[5], menuItems[10]],
    discount: 15,
    isPopular: true
  },
  {
    id: 2,
    name: 'Комбо "Острый"',
    description: 'Острая шаурма + картофель фри + напиток',
    price: 470,
    image: '/combos/spicy.jpg',
    items: [menuItems[1], menuItems[5], menuItems[10]],
    discount: 10,
    isPopular: false
  },
  {
    id: 3,
    name: 'Комбо "Вегетарианское"',
    description: 'Вегетарианская шаурма + картофель фри + напиток',
    price: 430,
    image: '/combos/vegetarian.jpg',
    items: [menuItems[2], menuItems[5], menuItems[10]],
    discount: 15,
    isPopular: false
  }
]; 