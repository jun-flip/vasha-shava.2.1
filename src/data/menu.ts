import { MenuItem } from '../types';

const commonAdditives = [
  { id: 'additive-1', name: 'Сыр Гауда', price: 30 },
  { id: 'additive-2', name: 'Пармезан', price: 40 },
  { id: 'additive-3', name: 'Краснодарский сыр', price: 35 },
  { id: 'additive-4', name: 'Огурцы', price: 15 },
  { id: 'additive-5', name: 'Помидоры', price: 15 },
  { id: 'additive-6', name: 'Болгарский перец', price: 20 },
  { id: 'additive-7', name: 'Лук', price: 10 },
  { id: 'additive-8', name: 'Соус барбекю', price: 20 },
  { id: 'additive-9', name: 'Соус карри', price: 25 },
  { id: 'additive-10', name: 'Соус тахини', price: 25 }
];

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Классика',
    description: 'Свежая лепешка, курица гриль, свежие овощи, фирменный соус',
    price: 200,
    image: '/chickhen.webp',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'item-4',
    name: 'Острый лаваш',
    description: 'Свежая лепешка, курица гриль, острый соус, свежие овощи, перец чили',
    price: 350,
    image: '/54a09bfeece4f0c4508e539f89498ece.jpeg',
    category: 'spicy',
    isSpicy: true,
    additives: commonAdditives
  },
  {
    id: 'item-13',
    name: 'Фалафель в лаваше',
    description: 'Свежая лепешка, фалафель, хумус, свежие овощи, соус тахини',
    price: 200,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 'item-16',
    name: 'Чай черный',
    description: 'Ароматный черный чай с лимоном',
    price: 45,
    image: '/placeholder.svg',
    category: 'drinks'
  },
  {
    id: 'item-17',
    name: 'Чай зеленый',
    description: 'Свежий зеленый чай с жасмином',
    price: 50,
    image: '/placeholder.svg',
    category: 'drinks'
  }
]; 