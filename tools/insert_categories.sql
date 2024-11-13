
        CREATE TABLE IF NOT EXISTS names (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            meaning TEXT,
            UNIQUE (name)
        );

        CREATE TABLE IF NOT EXISTS name_categories (
            name_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (name_id, category_id),
            FOREIGN KEY (name_id) REFERENCES names(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );
        
INSERT INTO names (id, name, meaning) VALUES (1, 'Emma', 'Die Große') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (1, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (1, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (1, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (2, 'Liam', 'Entschlossener Beschützer') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (2, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (3, 'Mia', 'Meine Geliebte') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (3, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (3, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (3, 10) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (4, 'Noah', 'Ruhe Trost') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (4, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (5, 'Sophia', 'Weisheit') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (5, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (5, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (5, 14) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (6, 'Benjamin', 'Sohn Der Rechten Hand') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (6, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (6, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (6, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (7, 'Olivia', 'Olivenbaum') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (7, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (7, 14) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (7, 6) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (8, 'Lucas', 'Licht') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (8, 11) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (8, 8) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (8, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (9, 'Charlotte', 'Die Freie') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (9, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (9, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (9, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (10, 'Ella', 'Licht') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (10, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (10, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (10, 10) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (11, 'Henry', 'Der Herrscher Des Hauses') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (11, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (11, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (11, 14) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (12, 'Amelia', 'Die Fleißige') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (12, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (12, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (12, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (13, 'Alexander', 'Der Beschützer Der Menschheit') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (13, 14) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (13, 9) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (13, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (14, 'Mila', 'Die Liebenswerte') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (14, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (14, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (14, 9) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (15, 'James', 'Der Übernehmer') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (15, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (15, 14) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (16, 'Evelyn', 'Der Vögelchen Freund') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (16, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (16, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (16, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (17, 'Aiden', 'Kleines Feuer') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (17, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (18, 'Luna', 'Mond') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (18, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (18, 6) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (18, 11) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (19, 'Harper', 'Die Harfenspielerin') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (19, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (19, 7) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (20, 'Leo', 'Löwe') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (20, 2) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (20, 13) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (20, 4) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (21, 'Mika', 'Wer ist wie Gott?') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (21, 3) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (22, 'Aino', 'Einzigartige') ON CONFLICT (name) DO NOTHING;
INSERT INTO name_categories (name_id, category_id) VALUES (22, 3) ON CONFLICT (name_id, category_id) DO NOTHING;
INSERT INTO names (id, name, meaning) VALUES (23, 'meep', 'no') ON CONFLICT (name) DO NOTHING;