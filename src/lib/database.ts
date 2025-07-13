import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Определяем путь к базе данных в зависимости от окружения
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel 
  ? '/tmp/orders.db'  // Временная директория для Vercel
  : path.join(process.cwd(), 'orders.db');

// Создаем подключение к базе данных
let db: Database.Database;

try {
  db = new Database(dbPath);
  console.log(`Database connected to: ${dbPath}`);
} catch (error) {
  console.error('Error connecting to database:', error);
  throw error;
}

// Инициализация таблиц
export function initializeDatabase() {
  console.log('Initializing database...');
  
  // Создаем таблицу заказов
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      comment TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized successfully');
}

// Функция для получения последнего номера заказа
export function getLastOrderNumber(): number {
  const stmt = db.prepare('SELECT MAX(order_number) as last_number FROM orders');
  const result = stmt.get() as { last_number: number | null };
  return result.last_number || 0;
}

// Функция для создания нового заказа
export function createOrder(orderData: {
  order_number: number;
  name: string;
  phone: string;
  address: string;
  items: any[];
  total: number;
  comment?: string;
  status?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO orders (order_number, name, phone, address, items, total, comment, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    orderData.order_number,
    orderData.name,
    orderData.phone,
    orderData.address,
    JSON.stringify(orderData.items),
    orderData.total,
    orderData.comment || null,
    orderData.status || 'new'
  );
  
  return result;
}

// Функция для получения всех заказов
export function getAllOrders() {
  const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  return stmt.all();
}

// Функция для получения заказа по ID
export function getOrderById(id: number) {
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  return stmt.get(id);
}

// Функция для обновления статуса заказа
export function updateOrderStatus(id: number, status: string) {
  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
  return stmt.run(status, id);
}

// Инициализируем базу данных при импорте модуля
initializeDatabase();

export default db; 