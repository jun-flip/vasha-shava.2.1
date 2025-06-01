-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order_number
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status); 