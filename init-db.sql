CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2),
    departure_date TIMESTAMP WITH TIME ZONE,
    return_date TIMESTAMP WITH TIME ZONE,
    airline VARCHAR(100),
    flight_number VARCHAR(20),
    legs JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(origin, destination, departure_date, flight_number)
);

CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON routes(origin, destination);
CREATE INDEX IF NOT EXISTS idx_routes_departure_date ON routes(departure_date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to update the updated_at column on each update
DROP TRIGGER IF EXISTS update_routes_modtime ON routes;
CREATE TRIGGER update_routes_modtime
BEFORE UPDATE ON routes
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
