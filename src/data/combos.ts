import { Combo } from '../types';
import { menuItems } from './menu';

export const combos: Combo[] = [
  {
    id: 'combo-1',
    name: 'Классика',
    description: 'Классическая шаурма с картошкой фри и напитком',
    price: 450,
    image: '/images/placeholder-combo.svg',
    items: [
      menuItems.find(item => item.id === 'shawarma-1')!,
      menuItems.find(item => item.id === 'fries-1')!,
      menuItems.find(item => item.id === 'drink-1')!
    ],
    discount: 15,
    isPopular: true
  },
  {
    id: 'combo-2',
    name: 'Острый',
    description: 'Острая шаурма с картошкой фри и напитком',
    price: 470,
    image: '/images/placeholder-combo.svg',
    items: [
      menuItems.find(item => item.id === 'shawarma-2')!,
      menuItems.find(item => item.id === 'fries-1')!,
      menuItems.find(item => item.id === 'drink-1')!
    ],
    discount: 10,
    isPopular: false
  },
  {
    id: 'combo-3',
    name: 'Вегетарианское',
    description: 'Вегетарианская шаурма с картошкой фри и напитком',
    price: 430,
    image: '/images/placeholder-combo.svg',
    items: [
      menuItems.find(item => item.id === 'shawarma-3')!,
      menuItems.find(item => item.id === 'fries-1')!,
      menuItems.find(item => item.id === 'drink-1')!
    ],
    discount: 15,
    isPopular: false
  }
]; 