
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            letter_code VARCHAR(10) NULL,
            total_cards INTEGER DEFAULT 0,
            total_male_cards INTEGER DEFAULT 0,
            total_female_cards INTEGER DEFAULT 0,
            visible BOOLEAN DEFAULT FALSE,
            UNIQUE (name, letter_code)
        );
        
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Germany', 'DE', 4304, 1944, 2360, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Austria', 'AT', 147, 58, 89, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Sweden', 'SE', 1325, 544, 781, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Switzerland', 'CH', 451, 199, 252, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Ukraine', 'UA', 211, 87, 124, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('United Kingdom', 'GB', 6434, 2799, 3635, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('France', 'FR', 2370, 880, 1490, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('United States', 'US', 1863, 724, 1139, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Finland', 'FI', 898, 380, 518, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Italy', 'IT', 2314, 960, 1354, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Spain', 'ES', 2336, 994, 1342, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Poland', 'PL', 795, 333, 462, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Portugal', 'PT', 999, 474, 525, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Russian Federation', 'RU', 1110, 441, 669, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Ireland', 'IE', 989, 527, 462, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Czechia', 'CZ', 569, 263, 306, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Greece', 'GR', 1071, 477, 594, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Norway', 'NO', 1020, 492, 528, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Denmark', 'DK', 991, 452, 539, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('South Africa', 'ZA', 138, 55, 83, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Zimbabwe', 'ZW', 21, 8, 13, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Botswana', 'BW', 15, 10, 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Saudi Arabia', 'SA', 2451, 1225, 1226, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Romania', 'RO', 464, 190, 274, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Hungary', 'HU', 718, 288, 430, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Brazil', 'BR', 392, 160, 232, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Estonia', 'EE', 257, 105, 152, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Albania', 'AL', 1551, 732, 819, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Bosnia and Herzegovina', 'BA', 1016, 456, 560, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Croatia', 'HR', 1195, 548, 647, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('North Macedonia', 'MK', 519, 228, 291, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Serbia', 'RS', 985, 475, 510, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Slovenia', 'SI', 843, 325, 518, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Israel', 'IL', 730, 391, 339, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Netherlands', 'NL', 1785, 821, 964, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Bulgaria', 'BG', 626, 266, 360, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Faroe Islands', 'FO', 128, 57, 71, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Greenland', 'GL', 61, 22, 39, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Iceland', 'IS', 428, 199, 229, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Slovakia', 'SK', 296, 132, 164, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Latvia', 'LV', 150, 18, 132, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Lithuania', 'LT', 146, 26, 120, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Belarus', 'BY', 80, 31, 49, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Malta', 'MT', 11, 2, 9, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Georgia', 'GE', 105, 47, 58, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Montenegro', 'ME', 30, 23, 7, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Kazakhstan', 'KZ', 42, 24, 18, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Iran, Islamic Republic of', 'IR', 934, 437, 497, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Türkiye', 'TR', 2646, 1399, 1247, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('India', 'IN', 1832, 955, 877, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Thailand', 'TH', 71, 22, 49, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Belgium', 'BE', 267, 95, 172, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Indonesia', 'ID', 220, 128, 92, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Japan', 'JP', 1072, 574, 498, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Uzbekistan', 'UZ', 28, 16, 12, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Korea, Republic of', 'KR', 34, 20, 14, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Algeria', 'DZ', 160, 79, 81, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('China', 'CN', 230, 136, 94, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Canada', 'CA', 125, 54, 71, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Australia', 'AU', 77, 23, 54, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Mongolia', 'MN', 46, 31, 15, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Iraq', 'IQ', 29, 25, 4, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('New Zealand', 'NZ', 38, 8, 30, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Armenia', 'AM', 80, 52, 28, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Mexico', 'MX', 98, 36, 62, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Turkmenistan', 'TM', 19, 14, 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Peru', 'PE', 10, 5, 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Azerbaijan', 'AZ', 120, 75, 45, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Maldives', 'MV', 5, 2, 3, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Malaysia', 'MY', 103, 56, 47, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Luxembourg', 'LU', 19, 9, 10, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Philippines', 'PH', 79, 35, 44, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Uganda', 'UG', 1, 1, 0, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Moldova, Republic of', 'MD', 47, 22, 25, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Ghana', 'GH', 14, 10, 4, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Ethiopia', 'ET', 3, 2, 1, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Kenya', 'KE', 214, 77, 137, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Myanmar', 'MM', 5, 1, 4, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Pakistan', 'PK', 315, 215, 100, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Tunisia', 'TN', 169, 82, 87, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Morocco', 'MA', 115, 56, 59, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Afghanistan', 'AF', 432, 208, 224, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Syrian Arab Republic', 'SY', 30, 19, 11, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Libya', 'LY', 3, 1, 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Somalia', 'SO', 8, 4, 4, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Lebanon', 'LB', 7, 6, 1, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Senegal', 'SN', 5, 3, 2, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Madagascar', 'MG', 5, 0, 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Namibia', 'NA', 1, 1, 0, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Tajikistan', 'TJ', 11, 6, 5, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Jamaica', 'JM', 6, 2, 4, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Nigeria', 'NG', 195, 113, 82, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;
INSERT INTO categories (name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ('Chile', 'CL', 15, 7, 8, TRUE) ON CONFLICT (name, letter_code) DO NOTHING;