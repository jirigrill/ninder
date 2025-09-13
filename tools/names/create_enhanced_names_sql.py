#!/usr/bin/env python3
"""
Enhanced Names SQL Generator Pipeline

Combines three data sources:
1. Original names (from existing SQL)
2. Custom names (from JSON list)  
3. Scraped data (meanings/descriptions)

Outputs a single SQL file with all names enhanced where scraped data is available.
"""

import json
import argparse
import logging
import re
from typing import Dict, Set, List, Optional
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class NameEntry:
    name: str
    sex: str = 'male'
    popular: bool = False
    tags: str = ''
    meaning: Optional[str] = None
    description: Optional[str] = None
    origin: Optional[str] = None
    scraped_at: Optional[str] = None
    categories: List[int] = None
    
    def __post_init__(self):
        if self.categories is None:
            self.categories = []

class EnhancedNamesSQLGenerator:
    def __init__(self):
        self.scraped_data = {}
        self.original_names = {}
        self.custom_names = []
        self.next_id = 0
    
    def load_scraped_data(self, scraped_file: str):
        """Load scraped name data from backup JSON"""
        try:
            with open(scraped_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            for name_data in backup_data.get('names', []):
                name_key = name_data['name'].lower()
                self.scraped_data[name_key] = {
                    'meaning': name_data.get('meaning'),
                    'description': name_data.get('description'),
                    'origin': name_data.get('origin'),
                    'scraped_at': name_data.get('scraped_at')
                }
            
            logger.info(f"Loaded {len(self.scraped_data)} scraped names")
            
        except Exception as e:
            logger.error(f"Failed to load scraped data: {e}")
    
    def load_original_names(self, original_names_file: str):
        """Load original names from JSON file"""
        try:
            with open(original_names_file, 'r', encoding='utf-8') as f:
                names_data = json.load(f)
            
            # Handle different formats
            if isinstance(names_data, dict):
                # Format: {"male": ["Name1", "Name2"], "female": ["Name3", "Name4"]}
                for sex, names in names_data.items():
                    if isinstance(names, list):
                        for name in names:
                            if isinstance(name, str):
                                self.original_names[name.lower()] = NameEntry(
                                    name=name,
                                    sex=sex,
                                    tags='original'
                                )
                            elif isinstance(name, dict):
                                self.original_names[name['name'].lower()] = NameEntry(
                                    name=name.get('name', ''),
                                    sex=sex,
                                    popular=name.get('popular', False),
                                    tags=name.get('tags', 'original')
                                )
            
            elif isinstance(names_data, list):
                # Format: [{"name": "Name1", "sex": "male"}, {"name": "Name2", "sex": "female"}]
                for name in names_data:
                    if isinstance(name, str):
                        # Simple string - default to male
                        self.original_names[name.lower()] = NameEntry(name=name, tags='original')
                    elif isinstance(name, dict):
                        # Object with name and properties
                        name_key = name.get('name', '').lower()
                        if name_key:
                            self.original_names[name_key] = NameEntry(
                                name=name.get('name', ''),
                                sex=name.get('sex', 'male'),
                                popular=name.get('popular', False),
                                tags=name.get('tags', 'original')
                            )
            
            logger.info(f"Loaded {len(self.original_names)} original names")
            
        except Exception as e:
            logger.error(f"Failed to load original names: {e}")
    
    def load_custom_names(self, custom_names_file: str):
        """Load custom names from JSON list"""
        try:
            with open(custom_names_file, 'r', encoding='utf-8') as f:
                names_data = json.load(f)
            
            # Handle both simple list and object format
            if isinstance(names_data, list):
                # Simple list of names
                for name in names_data:
                    if isinstance(name, str):
                        self.custom_names.append(NameEntry(name=name))
                    elif isinstance(name, dict):
                        # Object with name and optional properties
                        self.custom_names.append(NameEntry(
                            name=name.get('name', ''),
                            sex=name.get('sex', 'male'),
                            popular=name.get('popular', False),
                            tags=name.get('tags', 'custom')
                        ))
            
            logger.info(f"Loaded {len(self.custom_names)} custom names")
            
        except Exception as e:
            logger.error(f"Failed to load custom names: {e}")
    
    def enhance_with_scraped_data(self, name_entry: NameEntry) -> NameEntry:
        """Enhance name entry with scraped data if available"""
        name_key = name_entry.name.lower()
        
        if name_key in self.scraped_data:
            scraped = self.scraped_data[name_key]
            name_entry.meaning = scraped.get('meaning')
            name_entry.description = scraped.get('description')
            name_entry.origin = scraped.get('origin')
            name_entry.scraped_at = scraped.get('scraped_at')
            logger.debug(f"Enhanced {name_entry.name} with scraped data")
        
        return name_entry
    
    def escape_sql_string(self, value: str) -> str:
        """Safely escape string for SQL"""
        if not value:
            return 'NULL'
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    
    def generate_sql(self, output_file: str):
        """Generate enhanced SQL file with all names"""
        try:
            all_names = {}
            
            # Add original names
            for name_key, name_entry in self.original_names.items():
                all_names[name_key] = self.enhance_with_scraped_data(name_entry)
            
            # Add custom names (don't overwrite existing)
            for name_entry in self.custom_names:
                name_key = name_entry.name.lower()
                if name_key not in all_names:
                    all_names[name_key] = self.enhance_with_scraped_data(name_entry)
                else:
                    logger.warning(f"Skipping duplicate name: {name_entry.name}")
            
            logger.info(f"Generating SQL for {len(all_names)} total names")
            
            # Generate SQL
            sql_lines = []
            name_id = 0
            enhanced_count = 0
            
            for name_key, name_entry in sorted(all_names.items()):
                # Count enhanced names
                if name_entry.meaning or name_entry.description or name_entry.origin:
                    enhanced_count += 1
                
                # Generate INSERT statement
                meaning = self.escape_sql_string(name_entry.meaning)
                description = self.escape_sql_string(name_entry.description)
                origin = self.escape_sql_string(name_entry.origin)
                scraped_at = f"'{name_entry.scraped_at}'" if name_entry.scraped_at else 'NULL'
                popular = 'true' if name_entry.popular else 'false'
                tags = self.escape_sql_string(name_entry.tags)
                
                sql_lines.append(
                    f"INSERT INTO names (id, name, sex, popular, tags, meaning, description, origin, scraped_at) "
                    f"VALUES ({name_id}, '{name_entry.name}', '{name_entry.sex}', {popular}, {tags}, "
                    f"{meaning}, {description}, {origin}, {scraped_at}) "
                    f"ON CONFLICT (name) DO NOTHING;"
                )
                
                name_id += 1
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("-- Enhanced Names SQL with Scraped Data\n")
                f.write(f"-- Generated: {len(all_names)} total names\n")
                f.write(f"-- Enhanced: {enhanced_count} names with scraped data\n\n")
                f.write('\n'.join(sql_lines))
            
            logger.info(f"Generated SQL file: {output_file}")
            logger.info(f"Total names: {len(all_names)}")
            logger.info(f"Enhanced with scraped data: {enhanced_count}")
            
        except Exception as e:
            logger.error(f"Failed to generate SQL: {e}")

def main():
    parser = argparse.ArgumentParser(description='Generate enhanced names SQL from multiple sources')
    parser.add_argument('--original-names', type=str, 
                       help='Original names JSON file')
    parser.add_argument('--custom-names', type=str, required=True,
                       help='Custom names JSON file')
    parser.add_argument('--scraped-data', type=str, default='tools/scraped_names_backup.json',
                       help='Scraped data backup file')
    parser.add_argument('--output', type=str, default='tools/enhanced_names_complete.sql',
                       help='Output SQL file')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    generator = EnhancedNamesSQLGenerator()
    
    try:
        # Load scraped data
        generator.load_scraped_data(args.scraped_data)
        
        # Load original names if provided
        if args.original_names:
            generator.load_original_names(args.original_names)
        
        # Load custom names
        generator.load_custom_names(args.custom_names)
        
        # Generate enhanced SQL
        generator.generate_sql(args.output)
        
        print(f"Enhanced SQL file generated: {args.output}")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())