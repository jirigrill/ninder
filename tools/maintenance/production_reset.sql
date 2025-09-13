-- Production Reset Script
-- This script resets all user data while preserving names and categories

BEGIN;

-- Delete all user-generated data
DELETE FROM card_interactions;
DELETE FROM sessions;
DELETE FROM users;
DELETE FROM advices;
DELETE FROM category_history;

-- Reset sequences for clean IDs
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE card_interactions_id_seq RESTART WITH 1;
ALTER SEQUENCE advices_id_seq RESTART WITH 1;
ALTER SEQUENCE category_history_id_seq RESTART WITH 1;

-- Show remaining data
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Sessions:' as table_name, COUNT(*) as count FROM sessions
UNION ALL
SELECT 'Card Interactions:' as table_name, COUNT(*) as count FROM card_interactions
UNION ALL
SELECT 'Names:' as table_name, COUNT(*) as count FROM names
UNION ALL
SELECT 'Categories:' as table_name, COUNT(*) as count FROM categories;

COMMIT;

-- Show names without scraped data
SELECT COUNT(*) as names_without_meaning 
FROM names 
WHERE meaning IS NULL OR meaning = '' OR scraped_at IS NULL;