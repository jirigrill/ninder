# Ninder Development Makefile

.PHONY: help install dev db-up db-down db-reset db-studio reset-data build docker-dev docker-prod clean

# Default target
help:
	@echo "Ninder Development Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start local development server"
	@echo "  make install      - Install dependencies"
	@echo ""
	@echo "Database:"
	@echo "  make db-up        - Start PostgreSQL database only"
	@echo "  make db-down      - Stop PostgreSQL database"
	@echo "  make db-reset     - Reset database with migrations"
	@echo "  make db-studio    - Open Prisma Studio (database GUI)"
	@echo "  make load-data    - Load categories and names (includes scraped data if available)"
	@echo "  make reset-data   - Reset user data (keep names/categories)"
	@echo ""
	@echo "Data Enrichment:"
	@echo "  make scrape-setup - Setup Python environment for web scraping"
	@echo "  make scrape-names - Scrape meanings for 50 names (5-10 minutes)"
	@echo "  make scrape-names-full - Scrape meanings for 1000 names (hours)"
	@echo "  make backup-scraped - Export scraped data to JSON backup"
	@echo "  make restore-scraped - Import scraped data from JSON backup"
	@echo "  make update-sql-with-scraped - Create SQL with scraped data included"
	@echo "  make scrape-status  - Check how many names have been scraped"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-dev   - Start full app with Docker Compose"
	@echo "  make docker-prod  - Build and start production Docker"
	@echo "  make docker-down  - Stop all Docker containers"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Clean node_modules and rebuild"
	@echo "  make check        - Run type checking and linting"

# Development commands
install:
	@echo "Installing dependencies..."
	npm install
	npx prisma generate

dev: db-up
	@echo "Starting development server..."
	@echo "App will be available at: http://localhost:5173"
	npm run dev

# Database commands
db-up:
	@echo "Starting PostgreSQL database..."
	docker-compose up postgres -d --remove-orphans
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo "Running database migrations..."
	npx prisma migrate deploy || npx prisma migrate dev
	@echo "Database ready!"

db-down:
	@echo "Stopping PostgreSQL database..."
	docker-compose stop postgres

db-reset: db-up
	@echo "Resetting database..."
	npx prisma migrate reset --force
	@echo "Database reset complete!"

db-studio:
	@echo "Opening Prisma Studio..."
	npx prisma studio

reset-data:
	@echo "Resetting user data..."
	./tools/run-reset.sh

load-data:
	@echo "Loading categories and names data..."
	@echo "Copying SQL files to container..."
	docker cp tools/generate_categories.sql $$(docker-compose ps -q postgres):/tmp/categories.sql
	@if [ -f tools/generate_names_with_scraped.sql ]; then \
		echo "Found enhanced SQL with scraped data!"; \
		docker cp tools/generate_names_with_scraped.sql $$(docker-compose ps -q postgres):/tmp/names.sql; \
	else \
		echo "Using basic SQL file (no scraped data)"; \
		docker cp tools/generate_names.sql $$(docker-compose ps -q postgres):/tmp/names.sql; \
	fi
	@echo "Loading categories..."
	docker-compose exec postgres psql -U ninder_user -d ninder -f /tmp/categories.sql
	@echo "Loading names (this may take a moment)..."
	docker-compose exec postgres psql -U ninder_user -d ninder -f /tmp/names.sql
	@if [ -f tools/scraped_names_backup.json ] && [ ! -f tools/generate_names_with_scraped.sql ]; then \
		echo "Found scraped data backup, restoring..."; \
		$(MAKE) restore-scraped; \
	fi
	@echo "Data loading complete!"

scrape-setup:
	@echo "Setting up name scraper..."
	python3 -m venv tools/scraper_env
	tools/scraper_env/bin/pip install -r tools/scraper_requirements.txt
	@echo "Scraper environment ready!"

scrape-names:
	@echo "Scraping name meanings from BehindTheName.com..."
	tools/scraper_env/bin/python tools/name_scraper.py --limit 50 --delay 2.0 4.0
	@echo "Scraping complete!"

scrape-names-full:
	@echo "Scraping ALL names (this will take hours)..."
	tools/scraper_env/bin/python tools/name_scraper.py --delay 1.0 3.0
	@echo "Full scraping complete!"

backup-scraped:
	@echo "Backing up scraped name data..."
	tools/scraper_env/bin/python tools/backup_scraped_data.py export
	@echo "Scraped data backed up to tools/scraped_names_backup.json"

restore-scraped:
	@echo "Restoring scraped name data..."
	tools/scraper_env/bin/python tools/backup_scraped_data.py import
	@echo "Scraped data restored from backup!"

update-sql-with-scraped:
	@echo "Updating SQL files with scraped data..."
	tools/scraper_env/bin/python tools/backup_scraped_data.py update-sql
	@echo "Enhanced SQL file created: tools/generate_names_with_scraped.sql"
	@echo "You can now use this file for future deployments!"

scrape-status:
	@echo "Checking scraping status..."
	@docker-compose exec postgres psql -U ninder_user -d ninder -c " \
		SELECT \
			COUNT(*) as total_names, \
			COUNT(CASE WHEN scraped_at IS NOT NULL THEN 1 END) as scraped_names, \
			COUNT(CASE WHEN meaning IS NOT NULL AND meaning != '' THEN 1 END) as has_meaning, \
			COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as has_description, \
			COUNT(CASE WHEN origin IS NOT NULL AND origin != '' THEN 1 END) as has_origin \
		FROM names WHERE name ~ '^[A-Za-z]+$$'; \
	"
	@echo "Use 'make scrape-names' to scrape meanings for remaining names"

# Docker commands
docker-dev:
	@echo "Starting full app with Docker Compose..."
	docker-compose up --build -d
	@echo "App available at: http://localhost:3002"

docker-prod:
	@echo "Building and starting production Docker..."
	docker-compose -f docker-compose.yml up --build -d
	@echo "App available at: http://localhost:3002"

docker-down:
	@echo "Stopping all Docker containers..."
	docker-compose down

# Utility commands
clean:
	@echo "Cleaning project..."
	rm -rf node_modules
	rm -rf .svelte-kit
	npm install
	npx prisma generate

check:
	@echo "Running type checking..."
	npm run check
	@echo "Running linting..."
	npm run lint

# Environment setup
setup-env:
	@echo "Setting up environment..."
	@if [ ! -f .env ]; then \
		echo "DATABASE_URL=postgresql://ninder_user:your_secure_password_change_me@localhost:5432/ninder" > .env; \
		echo "Created .env file"; \
	else \
		echo ".env file already exists"; \
	fi

# Quick start for new developers
quickstart: setup-env install db-up
	@echo ""
	@echo "Ninder is ready for development!"
	@echo ""
	@echo "Next steps:"
	@echo "  make dev          # Start development server"
	@echo "  make db-studio    # Open database GUI"
	@echo ""