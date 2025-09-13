-- Delete all names that don't have scraped meaning data
-- This will leave only names with scraped information

BEGIN;

-- First, delete card_interactions for names without scraped data
DELETE FROM card_interactions 
WHERE name_id IN (
    SELECT id FROM names 
    WHERE meaning IS NULL OR meaning = '' OR scraped_at IS NULL
);

-- Delete name_categories relationships for names without scraped data
DELETE FROM name_categories 
WHERE name_id IN (
    SELECT id FROM names 
    WHERE meaning IS NULL OR meaning = '' OR scraped_at IS NULL
);

-- Finally, delete the names themselves
DELETE FROM names 
WHERE meaning IS NULL OR meaning = '' OR scraped_at IS NULL;

-- Show remaining names
SELECT COUNT(*) as remaining_names FROM names;
SELECT name, meaning FROM names ORDER BY name;

COMMIT;