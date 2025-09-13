#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /opt/ninder/backups
docker-compose -f /opt/ninder/docker-compose.prod.yml exec -T postgres pg_dump -U ninder_user ninder > /opt/ninder/backups/ninder_backup_$DATE.sql
find /opt/ninder/backups -name "*.sql" -mtime +7 -delete