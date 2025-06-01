-- Drop existing counter table and function
DROP FUNCTION IF EXISTS get_next_order_number();
DROP TABLE IF EXISTS order_counter;

-- Create a table for order counter
CREATE TABLE order_counter (
    id SERIAL PRIMARY KEY,
    current_count INTEGER NOT NULL DEFAULT 1116
);

-- Insert initial value
INSERT INTO order_counter (current_count) VALUES (1116);

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