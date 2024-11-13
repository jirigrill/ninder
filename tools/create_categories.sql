-- Create the categories table if it does not already exist
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    letter_code VARCHAR(10),
    total_cards INT NOT NULL
);

-- Insert data into the categories table
INSERT INTO categories (id, name, letter_code, total_cards) VALUES
    (0, 'Gemischt', NULL, 22),
    (1, 'Deutschland', 'DE', 11),
    (2, 'Finnland', 'FI', 2),
    (3, 'Frankreich', 'FR', 6),
    (4, 'Griechenland', 'GR', 0),
    (5, 'Italien', 'IT', 2),
    (6, 'Kanada', 'CA', 1),
    (7, 'Portugal', 'PT', 1),
    (8, 'Russland', 'RU', 2),
    (9, 'Schweden', 'SE', 2),
    (10, 'Spanien', 'ES', 2),
    (11, 'Ukraine', 'UA', 0),
    (12, 'USA', 'US', 20),
    (13, 'Vereinigtes Königreich', 'GB', 5)
ON CONFLICT (id) DO NOTHING;  -- Avoid duplicates if running script multiple times
