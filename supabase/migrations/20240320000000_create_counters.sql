-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id TEXT PRIMARY KEY,
    value BIGINT NOT NULL DEFAULT 0
);

-- Insert initial counter for orders
INSERT INTO counters (id, value)
VALUES ('orders', 0)
ON CONFLICT (id) DO NOTHING;

-- Create function to get next order number
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_number BIGINT;
BEGIN
    -- Update counter and get new value
    UPDATE counters
    SET value = value + 1
    WHERE id = 'orders'
    RETURNING value INTO next_number;
    
    RETURN next_number;
END;
$$; 