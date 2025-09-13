#!/bin/bash

# Script to reset user data in Ninder database
# Keeps categories and names, deletes all user-generated data

echo "Resetting user data in Ninder database..."
echo "This will delete: users, sessions, card_interactions, advices, category_history"
echo "This will keep: categories, names, name_categories"
echo ""

read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Executing reset..."
    docker-compose exec postgres psql -U ninder_user -d ninder -c "$(cat tools/reset-user-data.sql)"
    echo "Reset completed!"
else
    echo "Reset cancelled."
fi