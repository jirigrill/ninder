#!/bin/bash

# Ninder Production Setup Script
# This script resets everything and prepares for production deployment

set -e  # Exit on any error

echo "🚀 Starting Ninder Production Setup..."

# 1. Reset user data
echo "📝 Step 1: Resetting user data..."
docker cp tools/production_reset.sql $(docker-compose ps -q postgres):/tmp/production_reset.sql
docker-compose exec postgres psql -U ninder_user -d ninder -f /tmp/production_reset.sql

# 2. Reload full names database
echo "📝 Step 2: Reloading full names database..."
make load-data

# 3. Setup scraper environment
echo "📝 Step 3: Setting up scraper environment..."
make scrape-setup

# 4. Scrape all names (this will take a long time)
echo "📝 Step 4: Starting comprehensive name scraping..."
echo "⚠️  This will take several hours. You can monitor progress or run in background."
echo "   Press Ctrl+C to stop, or wait for completion."

# Scrape ALL names with longer delays to be respectful
echo "Starting comprehensive scraping of all names..."
echo "This will scrape all ~30,000 names and may take 12-24 hours"
tools/scraper_env/bin/python tools/name_scraper.py --delay 3.0 6.0

# 5. Backup scraped data
echo "📝 Step 5: Backing up scraped data..."
make backup-scraped

# 6. Create enhanced SQL files with scraped data
echo "📝 Step 6: Creating enhanced SQL files..."
make update-sql-with-scraped

echo "✅ Production setup complete!"
echo ""
echo "📊 Final Statistics:"
docker-compose exec postgres psql -U ninder_user -d ninder -c "
SELECT 
    COUNT(*) as total_names,
    COUNT(CASE WHEN scraped_at IS NOT NULL THEN 1 END) as scraped_names,
    COUNT(CASE WHEN meaning IS NOT NULL AND meaning != '' THEN 1 END) as has_meaning
FROM names;
"

echo ""
echo "🎯 Next Steps:"
echo "1. Review scraped data quality"
echo "2. Run 'make check' to verify code quality"
echo "3. Test the application thoroughly"
echo "4. Deploy using 'make docker-prod'"