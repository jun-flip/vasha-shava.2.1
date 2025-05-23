import { MenuItem } from '../types';

const commonAdditives = [
  { id: 1, name: 'Сыр Гауда', price: 30 },
  { id: 2, name: 'Пармезан', price: 40 },
  { id: 3, name: 'Краснодарский сыр', price: 35 },
  { id: 4, name: 'Огурцы', price: 15 },
  { id: 5, name: 'Помидоры', price: 15 },
  { id: 6, name: 'Болгарский перец', price: 20 },
  { id: 7, name: 'Лук', price: 10 },
  { id: 8, name: 'Соус барбекю', price: 20 },
  { id: 9, name: 'Соус карри', price: 25 },
  { id: 10, name: 'Соус тахини', price: 25 }
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Классика',
    description: 'Свежая лепешка, курица гриль, свежие овощи, фирменный соус',
    price: 200,
    image: '/chickhen.webp',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 2,
    name: 'Классика XL',
    description: 'Большая свежая лепешка, двойная порция курицы гриль, свежие овощи, фирменный соус',
    price: 290,
    image: '/chickhen.webp',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 3,
    name: 'Вегетарианская',
    description: 'Свежая лепешка, грибы, болгарский перец, помидоры, огурцы, фирменный соус',
    price: 220,
    image: '/vegan.jpeg',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 4,
    name: 'Острый лаваш',
    description: 'Свежая лепешка, курица гриль, острый соус, свежие овощи, перец чили',
    price: 350,
    image: '/54a09bfeece4f0c4508e539f89498ece.jpeg',
    category: 'spicy',
    isSpicy: true,
    additives: commonAdditives
  },
  {
    id: 5,
    name: 'Три сыра',
    description: 'Свежая лепешка, курица гриль, сыр Гауда, пармезан, краснодарский сыр, фирменный соус',
    price: 240,
    image: '/cheezy.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 6,
    name: 'Три сыра XL',
    description: 'Большая свежая лепешка, двойная порция курицы гриль, сыр Гауда, пармезан, краснодарский сыр, фирменный соус',
    price: 290,
    image: '/cheezy.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 7,
    name: 'Свободный лаваш',
    description: 'Собери свой идеальный лаваш: выбери начинку, соус и добавки',
    price: 180,
    image: '/chichenKarri.png ',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 8,
    name: 'Свободный лаваш XL',
    description: 'Большой лаваш с двойной порцией начинки на ваш выбор',
    price: 260,
    image: '/chichenKarri.png ',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 9,
    name: 'Гриль сет №1',
    description: 'Курица гриль, овощи гриль, соус барбекю, свежая лепешка',
    price: 250,
    image: '/grillSet.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 10,
    name: 'Гриль сет №2',
    description: 'Курица гриль, овощи гриль, соус барбекю, свежая лепешка, картофель фри',
    price: 450,
    image: '/grillSet.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 11,
    name: 'Донер',
    description: 'Свежая лепешка, курица гриль, свежие овощи, фирменный соус',
    price: 200,
    image: '/doner.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 12,
    name: 'Донер чикен карри',
    description: 'Свежая лепешка, курица карри, свежие овощи, соус карри',
    price: 250,
    image: '/doner.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 13,
    name: 'Фалафель в лаваше',
    description: 'Свежая лепешка, фалафель, хумус, свежие овощи, соус тахини',
    price: 200,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 14,
    name: 'Фалафель в лаваше XL',
    description: 'Большая свежая лепешка, двойная порция фалафеля, хумус, свежие овощи, соус тахини',
    price: 250,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 15,
    name: 'Фалафель в булке',
    description: 'Аппетитная булочка, фалафель, хумус, свежие овощи, соус тахини',
    price: 190,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 16,
    name: 'Чай черный',
    description: 'Ароматный черный чай с лимоном',
    price: 45,
    image: '/placeholder.svg',
    category: 'drinks'
  },
  {
    id: 17,
    name: 'Чай зеленый',
    description: 'Свежий зеленый чай с жасмином',
    price: 50,
    image: '/placeholder.svg',
    category: 'drinks'
  }
]; 