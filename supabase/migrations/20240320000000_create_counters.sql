-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id TEXT PRIMARY KEY,
    seq INTEGER NOT NULL DEFAULT 0
);

-- Create function to create counters table
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