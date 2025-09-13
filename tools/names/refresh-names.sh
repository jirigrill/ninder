#!/bin/bash

# Script to refresh names database with new custom names
# This will regenerate and load names data from all sources

echo "Refreshing names database..."
echo "This will regenerate names from original data + custom names"
echo ""

# Check if required files exist
if [ ! -f "tools/scrapy/consolidated.json" ]; then
    echo "Error: tools/scrapy/consolidated.json not found"
    exit 1
fi

if [ ! -f "tools/names/custom_names.json" ]; then
    echo "Error: tools/names/custom_names.json not found"
    exit 1
fi

if [ ! -f "tools/categories/categories.json" ]; then
    echo "Error: tools/categories/categories.json not found"
    exit 1
fi

read -p "Continue with names refresh? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Refresh cancelled."
    exit 0
fi

echo "Step 1: Generating consolidated names SQL..."
cd tools/names
python3 create_consolidated_names_sql.py \
    --original ../../tools/scrapy/consolidated.json \
    --custom-names custom_names.json \
    --categories ../../tools/categories/categories.json \
    --output consolidated_names.sql \
    --verbose

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate SQL"
    exit 1
fi

echo ""
echo "Step 2: Loading data into database..."
cd ../..
cat tools/names/consolidated_names.sql | docker-compose exec -T postgres psql -U ninder_user -d ninder

if [ $? -eq 0 ]; then
    echo ""
    echo "Names refresh completed successfully!"
    echo "You may need to restart the Docker container to see changes in the UI."
else
    echo "Error: Failed to load data into database"
    exit 1
fi