import { MenuItem, Additive } from '../types';

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

const additivesMeat: Additive[] = [
  { id: 'add-1', name: 'Больше мяса', price: 60 },
  { id: 'add-3', name: 'Сыр', price: 30 },
  { id: 'add-4', name: 'Овощи', price: 20 },
  { id: 'add-5', name: 'Фирменный соус', price: 15 },
];
const additivesFalafel: Additive[] = [
  { id: 'add-2', name: 'Больше фалафеля', price: 50 },
  { id: 'add-3', name: 'Сыр', price: 30 },
  { id: 'add-4', name: 'Овощи', price: 20 },
  { id: 'add-5', name: 'Фирменный соус', price: 15 },
];

export const additives: Additive[] = [
  { id: 'add-1', name: 'Больше мяса', price: 60 },
  { id: 'add-2', name: 'Больше фалафеля', price: 50 },
  { id: 'add-3', name: 'Сыр', price: 30 },
  { id: 'add-4', name: 'Овощи', price: 20 },
  { id: 'add-5', name: 'Фирменный соус', price: 15 },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Классическая шаурма',
    description: 'Нежное куриное мясо, свежие помидоры, огурцы, красный лук, капуста и наш фирменный соус в свежей лепешке',
    price: 300,
    image: '/menu/classic-shawarma.jpg',
    category: 'all',
    additives: additivesMeat,
  },
  {
    id: 2,
    name: 'Острая шаурма',
    description: 'Пикантная версия с острым перцем чили, халапеньо, специальным острым соусом и всеми классическими ингредиентами',
    price: 320,
    image: '/menu/spicy-shawarma.jpg',
    category: 'spicy',
    isSpicy: true,
    additives: additivesMeat,
  },
  {
    id: 3,
    name: 'Вегетарианская шаурма',
    description: 'Хрустящий фалафель, хумус, свежие овощи, зелень и соус тахини в мягкой лепешке',
    price: 280,
    image: '/menu/vegan-shawarma.jpg',
    category: 'vegetarian',
    additives: additivesFalafel,
  },
  {
    id: 4,
    name: 'Двойная шаурма',
    description: 'Двойная порция сочного мяса, увеличенная порция овощей и соуса для большого аппетита',
    price: 400,
    image: '/menu/double-shawarma.jpg',
    category: 'all',
    additives: additivesMeat,
  },
  {
    id: 5,
    name: 'Coca-Cola 0.5л',
    description: 'Охлаждённая классическая Coca-Cola',
    price: 90,
    image: '/menu/cola.jpg',
    category: 'drinks',
  },
  {
    id: 6,
    name: 'Сок апельсиновый 0.5л',
    description: 'Свежий сок без сахара',
    price: 110,
    image: '/menu/juice.jpg',
    category: 'drinks',
  },
]; 