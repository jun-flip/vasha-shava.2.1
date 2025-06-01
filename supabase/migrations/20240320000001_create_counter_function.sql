-- Create a table for order counter
CREATE TABLE IF NOT EXISTS order_counter (
    id SERIAL PRIMARY KEY,
    current_count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial value if table is empty
INSERT INTO order_counter (current_count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM order_counter);

-- Create a function to get and increment the counter
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_number INTEGER;
BEGIN
    UPDATE order_counter
    SET current_count = current_count + 1
    RETURNING current_count INTO next_number;
    
    RETURN next_number;
END;
$$; 