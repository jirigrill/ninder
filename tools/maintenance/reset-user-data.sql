-- Reset user data while keeping categories and names
-- This deletes all user-generated data but preserves the core name database

-- Delete user interactions and session data
DELETE FROM advices;
DELETE FROM card_interactions;
DELETE FROM category_history;
DELETE FROM sessions;
DELETE FROM users;

-- Categories, names, and name_categories tables remain untouched
-- This preserves the core name database with 30,000+ names and their categorization