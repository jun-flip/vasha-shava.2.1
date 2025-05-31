-- Проверяем существование таблицы и удаляем если есть
DROP TABLE IF EXISTS counters;

-- Создаем таблицу заново с правильной структурой
CREATE TABLE counters (
    id TEXT PRIMARY KEY,
    seq INTEGER NOT NULL DEFAULT 0
);

-- Создаем функцию для создания таблицы
CREATE OR REPLACE FUNCTION create_counters_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS counters (
        id TEXT PRIMARY KEY,
        seq INTEGER NOT NULL DEFAULT 0
    );
END;
$$;

-- Вставляем начальный счетчик
INSERT INTO counters (id, seq) VALUES ('orderCounter', 0);

-- Проверяем структуру таблицы
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'counters';

-- Проверяем данные в таблице
SELECT * FROM counters; 