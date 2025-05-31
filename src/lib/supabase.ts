import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? '***' : 'missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Функция для инициализации таблицы счетчиков
export async function initializeCounters() {
  try {
    // Проверяем существование таблицы counters
    const { error: checkError } = await supabase
      .from('counters')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') { // Таблица не существует
      console.log('Создание таблицы counters...');
      // Создаем таблицу counters
      const { error: createError } = await supabase.rpc('create_counters_table');
      if (createError) {
        console.error('Ошибка при создании таблицы counters:', createError);
        throw createError;
      }
    }

    // Проверяем существование счетчика заказов
    const { data: counter, error: counterError } = await supabase
      .from('counters')
      .select('id')
      .eq('id', 'orderCounter')
      .single();

    if (counterError && counterError.code === 'PGRST116') { // Счетчик не найден
      console.log('Создание счетчика заказов...');
      // Создаем счетчик заказов
      const { error: insertError } = await supabase
        .from('counters')
        .insert([{ id: 'orderCounter', seq: 0 }]);
      
      if (insertError) {
        console.error('Ошибка при создании счетчика заказов:', insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Ошибка при инициализации счетчиков:', error);
    throw error;
  }
} 