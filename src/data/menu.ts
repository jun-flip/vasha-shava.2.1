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
    id: 'shawarma-1',
    name: 'Классическая шаурма',
    description: 'Свежая лепешка, курица, овощи, соус',
    price: 250,
    image: '/images/placeholder-shawarma.svg',
    category: 'all',
    isPopular: true,
    calories: 450,
    preparationTime: 5,
    additives: [
      { id: 'additive-1', name: 'Сыр', price: 30 },
      { id: 'additive-2', name: 'Острый соус', price: 20 },
      { id: 'additive-3', name: 'Двойная порция мяса', price: 100 }
    ]
  },
  {
    id: 'shawarma-2',
    name: 'Острая шаурма',
    description: 'Свежая лепешка, курица, овощи, острый соус',
    price: 270,
    image: '/images/placeholder-shawarma.svg',
    category: 'spicy',
    isSpicy: true,
    calories: 460,
    preparationTime: 5,
    additives: [
      { id: 'additive-1', name: 'Сыр', price: 30 },
      { id: 'additive-2', name: 'Острый соус', price: 20 },
      { id: 'additive-3', name: 'Двойная порция мяса', price: 100 }
    ]
  },
  {
    id: 'shawarma-3',
    name: 'Вегетарианская шаурма',
    description: 'Свежая лепешка, овощи, соус',
    price: 230,
    image: '/images/placeholder-shawarma.svg',
    category: 'vegetarian',
    calories: 350,
    preparationTime: 5,
    additives: [
      { id: 'additive-1', name: 'Сыр', price: 30 },
      { id: 'additive-2', name: 'Острый соус', price: 20 }
    ]
  },
  {
    id: 'fries-1',
    name: 'Картофель фри',
    description: 'Хрустящий картофель фри с соусом',
    price: 150,
    image: '/images/placeholder-fries.svg',
    category: 'all',
    calories: 320,
    preparationTime: 3,
    additives: [
      { id: 'additive-4', name: 'Сырный соус', price: 30 },
      { id: 'additive-5', name: 'Соус барбекю', price: 30 }
    ]
  },
  {
    id: 'drink-1',
    name: 'Кока-Кола',
    description: 'Освежающий напиток',
    price: 100,
    image: '/images/placeholder-drink.svg',
    category: 'drinks',
    calories: 140,
    preparationTime: 1
  },
  {
    id: 'shawarma-4',
    name: 'Классика',
    description: 'Свежая лепешка, курица гриль, свежие овощи, фирменный соус',
    price: 200,
    image: '/chickhen.webp',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-5',
    name: 'Классика XL',
    description: 'Большая свежая лепешка, двойная порция курицы гриль, свежие овощи, фирменный соус',
    price: 290,
    image: '/chickhen.webp',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-6',
    name: 'Вегетарианская',
    description: 'Свежая лепешка, грибы, болгарский перец, помидоры, огурцы, фирменный соус',
    price: 220,
    image: '/vegan.jpeg',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 'shawarma-7',
    name: 'Острый лаваш',
    description: 'Свежая лепешка, курица гриль, острый соус, свежие овощи, перец чили',
    price: 350,
    image: '/54a09bfeece4f0c4508e539f89498ece.jpeg',
    category: 'spicy',
    isSpicy: true,
    additives: commonAdditives
  },
  {
    id: 'shawarma-8',
    name: 'Три сыра',
    description: 'Свежая лепешка, курица гриль, сыр Гауда, пармезан, краснодарский сыр, фирменный соус',
    price: 240,
    image: '/cheezy.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-9',
    name: 'Три сыра XL',
    description: 'Большая свежая лепешка, двойная порция курицы гриль, сыр Гауда, пармезан, краснодарский сыр, фирменный соус',
    price: 290,
    image: '/cheezy.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-10',
    name: 'Свободный лаваш',
    description: 'Собери свой идеальный лаваш: выбери начинку, соус и добавки',
    price: 180,
    image: '/chichenKarri.png ',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-11',
    name: 'Свободный лаваш XL',
    description: 'Большой лаваш с двойной порцией начинки на ваш выбор',
    price: 260,
    image: '/chichenKarri.png ',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-12',
    name: 'Гриль сет №1',
    description: 'Курица гриль, овощи гриль, соус барбекю, свежая лепешка',
    price: 250,
    image: '/grillSet.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-13',
    name: 'Гриль сет №2',
    description: 'Курица гриль, овощи гриль, соус барбекю, свежая лепешка, картофель фри',
    price: 450,
    image: '/grillSet.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-14',
    name: 'Донер',
    description: 'Свежая лепешка, курица гриль, свежие овощи, фирменный соус',
    price: 200,
    image: '/doner.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-15',
    name: 'Донер чикен карри',
    description: 'Свежая лепешка, курица карри, свежие овощи, соус карри',
    price: 250,
    image: '/doner.jpg',
    category: 'all',
    additives: commonAdditives
  },
  {
    id: 'shawarma-16',
    name: 'Фалафель в лаваше',
    description: 'Свежая лепешка, фалафель, хумус, свежие овощи, соус тахини',
    price: 200,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 'shawarma-17',
    name: 'Фалафель в лаваше XL',
    description: 'Большая свежая лепешка, двойная порция фалафеля, хумус, свежие овощи, соус тахини',
    price: 250,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 'shawarma-18',
    name: 'Фалафель в булке',
    description: 'Аппетитная булочка, фалафель, хумус, свежие овощи, соус тахини',
    price: 190,
    image: '/falafel.webp',
    category: 'vegetarian',
    additives: commonAdditives
  },
  {
    id: 'shawarma-19',
    name: 'Чай черный',
    description: 'Ароматный черный чай с лимоном',
    price: 45,
    image: '/placeholder.svg',
    category: 'drinks'
  },
  {
    id: 'shawarma-20',
    name: 'Чай зеленый',
    description: 'Свежий зеленый чай с жасмином',
    price: 50,
    image: '/placeholder.svg',
    category: 'drinks'
  }
]; 