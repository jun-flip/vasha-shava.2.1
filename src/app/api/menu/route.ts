import { NextResponse } from 'next/server';
import { MenuItem } from '../../../types';

// Временные данные меню (в реальном приложении они должны храниться в базе данных)
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Шаверма Классическая",
    description: "Лаваш, курица, овощи, соус",
    price: 250,
    image: "/shaurma.jpg",
    category: "all",
    additives: [
      { id: 1, name: "Сыр", price: 30 },
      { id: 2, name: "Грибы", price: 25 },
      { id: 3, name: "Огурцы", price: 20 },
      { id: 4, name: "Перец", price: 20 }
    ]
  },
  {
    id: 2,
    name: "Шаверма Острая",
    description: "Лаваш, курица, овощи, острый соус",
    price: 270,
    image: "/shaurma.jpg",
    category: "spicy",
    isSpicy: true,
    additives: [
      { id: 1, name: "Сыр", price: 30 },
      { id: 2, name: "Грибы", price: 25 },
      { id: 3, name: "Огурцы", price: 20 },
      { id: 4, name: "Перец", price: 20 }
    ]
  },
  {
    id: 3,
    name: "Шаверма Вегетарианская",
    description: "Лаваш, овощи, соус",
    price: 230,
    image: "/shaurma.jpg",
    category: "vegetarian",
    additives: [
      { id: 1, name: "Сыр", price: 30 },
      { id: 2, name: "Грибы", price: 25 },
      { id: 3, name: "Огурцы", price: 20 },
      { id: 4, name: "Перец", price: 20 }
    ]
  },
  {
    id: 4,
    name: "Кока-Кола",
    description: "Газированный напиток",
    price: 100,
    image: "/cola.jpg",
    category: "drinks"
  },
  {
    id: 5,
    name: "Спрайт",
    description: "Газированный напиток",
    price: 100,
    image: "/sprite.jpg",
    category: "drinks"
  },
  {
    id: 6,
    name: "Фанта",
    description: "Газированный напиток",
    price: 100,
    image: "/fanta.jpg",
    category: "drinks"
  }
];

export async function GET() {
  return NextResponse.json(menuItems);
} 