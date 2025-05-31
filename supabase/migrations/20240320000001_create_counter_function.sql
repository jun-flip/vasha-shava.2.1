-- Создаем функцию для атомарного обновления счетчика
CREATE OR REPLACE FUNCTION increment_order_counter()
RETURNS TABLE (seq INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE counters
    SET seq = seq + 1
    WHERE id = 'orderCounter'
    RETURNING seq;
END;
$$; 