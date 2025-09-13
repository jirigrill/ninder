#!/usr/bin/env python3
"""
Backup and restore scraped name data

This script exports scraped name meanings/descriptions to JSON and can restore them
after database reloads.
"""

import json
import psycopg2
import argparse
import logging
from datetime import datetime
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ScrapedDataManager:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.conn = None
        self.connect()
    
    def connect(self):
        """Connect to PostgreSQL database"""
        try:
            self.conn = psycopg2.connect(self.db_url)
            self.conn.autocommit = True
            logger.info("Connected to database")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def export_scraped_data(self, output_file: str) -> int:
        """Export all scraped name data to JSON"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                SELECT name, meaning, description, origin, scraped_at
                FROM names 
                WHERE scraped_at IS NOT NULL 
                AND (meaning IS NOT NULL OR description IS NOT NULL OR origin IS NOT NULL)
                ORDER BY name
            """)
            
            scraped_names = []
            for row in cursor.fetchall():
                name, meaning, description, origin, scraped_at = row
                scraped_names.append({
                    'name': name,
                    'meaning': meaning,
                    'description': description,
                    'origin': origin,
                    'scraped_at': scraped_at.isoformat() if scraped_at else None
                })
            
            cursor.close()
            
            # Write to JSON file
            backup_data = {
                'exported_at': datetime.now().isoformat(),
                'count': len(scraped_names),
                'names': scraped_names
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Exported {len(scraped_names)} scraped names to {output_file}")
            return len(scraped_names)
            
        except Exception as e:
            logger.error(f"Export failed: {e}")
            return 0
    
    def import_scraped_data(self, input_file: str) -> int:
        """Import scraped name data from JSON"""
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            names = backup_data.get('names', [])
            if not names:
                logger.warning("No scraped names found in backup file")
                return 0
            
            logger.info(f"Importing {len(names)} scraped names from {input_file}")
            
            cursor = self.conn.cursor()
            updated_count = 0
            
            for name_data in names:
                cursor.execute("""
                    UPDATE names 
                    SET meaning = %s,
                        description = %s,
                        origin = %s,
                        scraped_at = %s
                    WHERE LOWER(name) = LOWER(%s)
                    AND (meaning IS NULL OR description IS NULL OR origin IS NULL OR scraped_at IS NULL)
                """, (
                    name_data.get('meaning'),
                    name_data.get('description'), 
                    name_data.get('origin'),
                    name_data.get('scraped_at'),
                    name_data['name']
                ))
                
                if cursor.rowcount > 0:
                    updated_count += 1
            
            cursor.close()
            
            logger.info(f"Successfully imported scraped data for {updated_count} names")
            return updated_count
            
        except Exception as e:
            logger.error(f"Import failed: {e}")
            return 0
    
    def update_sql_files(self, scraped_data_file: str, names_sql_file: str, output_file: str):
        """Update the names SQL file to include scraped data"""
        try:
            # Load scraped data
            with open(scraped_data_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            scraped_dict = {}
            for name_data in backup_data.get('names', []):
                scraped_dict[name_data['name'].lower()] = name_data
            
            logger.info(f"Loaded {len(scraped_dict)} scraped names")
            
            # Read original SQL file
            with open(names_sql_file, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # Update SQL statements to include scraped data
            updated_lines = []
            updated_count = 0
            
            for line in sql_content.split('\n'):
                if line.startswith('INSERT INTO names ') and 'VALUES (' in line:
                    # Extract name from the INSERT statement
                    # Pattern: INSERT INTO names (...) VALUES (..., 'NameHere', ...);
                    start = line.find("', '") + 3
                    end = line.find("'", start)
                    
                    if start > 2 and end > start:
                        name = line[start:end]
                        scraped = scraped_dict.get(name.lower())
                        
                        if scraped:
                            # Replace the INSERT to include scraped data
                            # Old: INSERT INTO names (id, name, sex, popular, tags) VALUES (...)
                            # New: INSERT INTO names (id, name, sex, popular, tags, meaning, description, origin, scraped_at) VALUES (...)
                            
                            old_columns = "(id, name, sex, popular, tags)"
                            new_columns = "(id, name, sex, popular, tags, meaning, description, origin, scraped_at)"
                            
                            if old_columns in line:
                                # Extract the current VALUES part
                                values_start = line.find('VALUES (') + 8
                                values_end = line.rfind(')')
                                current_values = line[values_start:values_end]
                                
                                # Add scraped data
                                meaning = self.escape_sql_string(scraped.get('meaning'))
                                description = self.escape_sql_string(scraped.get('description'))
                                origin = self.escape_sql_string(scraped.get('origin'))
                                scraped_at = f"'{scraped.get('scraped_at')}'" if scraped.get('scraped_at') else 'NULL'
                                
                                new_values = f"{current_values}, {meaning}, {description}, {origin}, {scraped_at}"
                                
                                line = line.replace(old_columns, new_columns)
                                line = line.replace(f'VALUES ({current_values})', f'VALUES ({new_values})')
                                updated_count += 1
                
                updated_lines.append(line)
            
            # Write updated SQL file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(updated_lines))
            
            logger.info(f"Updated SQL file with scraped data for {updated_count} names")
            logger.info(f"Enhanced SQL saved to: {output_file}")
            
        except Exception as e:
            logger.error(f"SQL update failed: {e}")
    
    def escape_sql_string(self, value: str) -> str:
        """Safely escape string for SQL"""
        if not value:
            return 'NULL'
        # Escape single quotes and wrap in quotes
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()

def main():
    parser = argparse.ArgumentParser(description='Backup and restore scraped name data')
    parser.add_argument('action', choices=['export', 'import', 'update-sql'], 
                       help='Action to perform')
    parser.add_argument('--db-url', type=str,
                       default='postgresql://ninder_user:your_secure_password_change_me@localhost:5432/ninder',
                       help='Database connection URL')
    parser.add_argument('--file', type=str, default='tools/scraped_names_backup.json',
                       help='Backup file path')
    parser.add_argument('--sql-input', type=str, default='tools/generate_names.sql',
                       help='Original SQL file (for update-sql action)')
    parser.add_argument('--sql-output', type=str, default='tools/generate_names_with_scraped.sql',
                       help='Output SQL file with scraped data (for update-sql action)')
    
    args = parser.parse_args()
    
    manager = ScrapedDataManager(args.db_url)
    
    try:
        if args.action == 'export':
            count = manager.export_scraped_data(args.file)
            print(f"Exported {count} scraped names to {args.file}")
            
        elif args.action == 'import':
            count = manager.import_scraped_data(args.file)
            print(f"Imported scraped data for {count} names")
            
        elif args.action == 'update-sql':
            manager.update_sql_files(args.file, args.sql_input, args.sql_output)
            print(f"Updated SQL file: {args.sql_output}")
            
    except Exception as e:
        logger.error(f"Operation failed: {e}")
        return 1
    finally:
        manager.close()
    
    return 0

if __name__ == "__main__":
    exit(main())