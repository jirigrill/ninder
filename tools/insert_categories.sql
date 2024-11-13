
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            letter_code VARCHAR(10) NULL,
            total_cards INTEGER DEFAULT 0,
            visible BOOLEAN DEFAULT FALSE,
            UNIQUE (name, letter_code)
        );
        
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Gemischt', NULL, 23, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Deutschland', 'DE', 11, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Finnland', 'FI', 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Frankreich', 'FR', 6, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Griechenland', 'GR', 0, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Italien', 'IT', 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Kanada', 'CA', 1, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Portugal', 'PT', 1, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Russland', 'RU', 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Schweden', 'SE', 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Spanien', 'ES', 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Ukraine', 'UA', 0, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('USA', 'US', 20, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Vereinigtes Königreich', 'GB', 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Irland', 'IE', 2, FALSE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Israel', 'IL', 1, FALSE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('Süd Afrika', 'ZA', 1, FALSE) ON CONFLICT (name, letter_code) DO NOTHING;