#!/usr/bin/env python3
"""
Consolidated Names SQL Generator

Constructs complete SQL from raw data sources:
1. Scrapy consolidated.json (names with country/origin data)
2. Custom names JSON (grills names)
3. Categories JSON (category definitions)

Outputs SQL with names and name_categories relationships.
"""

import json
import argparse
import logging
from typing import Dict, List, Set
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class NameEntry:
    name: str
    sex: str = 'male'
    popular: bool = False
    tags: str = ''
    countries: List[str] = None
    origin: str = ''
    category_ids: Set[int] = None
    
    def __post_init__(self):
        if self.countries is None:
            self.countries = []
        if self.category_ids is None:
            self.category_ids = set()

@dataclass
class Category:
    id: int
    name: str
    letter_code: str
    icon_class: str
    set: str

class ConsolidatedNamesSQLGenerator:
    def __init__(self):
        self.original_names = {}
        self.custom_names = []
        self.categories = {}
        self.country_to_category = {}
    
    def load_categories(self, categories_file: str):
        """Load categories from JSON and build country mapping"""
        try:
            with open(categories_file, 'r', encoding='utf-8') as f:
                categories_data = json.load(f)
            
            for cat_data in categories_data:
                cat_id = int(cat_data.get('id', 0))
                category = Category(
                    id=cat_id,
                    name=cat_data.get('name', ''),
                    letter_code=cat_data.get('letterCode', ''),
                    icon_class=cat_data.get('iconClass', ''),
                    set=cat_data.get('set', '')
                )
                self.categories[cat_id] = category
                
                # Map country letter codes to category IDs
                letter_code = cat_data.get('letterCode', '')
                if letter_code and len(letter_code) == 2:  # Country codes are 2 letters
                    self.country_to_category[letter_code] = cat_id
            
            logger.info(f"Loaded {len(self.categories)} categories")
            logger.info(f"Mapped {len(self.country_to_category)} country codes to categories")
            
        except Exception as e:
            logger.error(f"Failed to load categories: {e}")
    
    def load_original_names(self, original_file: str):
        """Load names from scrapy consolidated.json"""
        try:
            with open(original_file, 'r', encoding='utf-8') as f:
                original_data = json.load(f)
            
            for item in original_data:
                name = item.get('name', '')
                if not name:
                    continue
                    
                # Build tags from available data
                tags = []
                if item.get('tags'):
                    tags.extend(item.get('tags', []))
                if item.get('origin'):
                    tags.append(f"origin:{item['origin']}")
                
                # Extract countries and map to categories
                countries = item.get('countries', [])
                category_ids = set()
                
                for country_code in countries:
                    if country_code in self.country_to_category:
                        category_ids.add(self.country_to_category[country_code])
                    tags.append(f"country:{country_code}")
                
                # Add to special categories based on tags
                item_tags = item.get('tags', [])
                if 'popular' in item_tags or item.get('popular', False):
                    category_ids.add(-2)  # Top 1000 category
                if 'rare' in item_tags:
                    category_ids.add(-3)  # Rare category
                
                self.original_names[name.lower()] = NameEntry(
                    name=name,
                    sex=item.get('sex', 'male'),
                    popular=item.get('popular', False),
                    tags=', '.join(tags) if tags else 'scraped',
                    countries=countries,
                    origin=item.get('origin', ''),
                    category_ids=category_ids
                )
            
            logger.info(f"Loaded {len(self.original_names)} original names")
            
        except Exception as e:
            logger.error(f"Failed to load original names: {e}")
    
    def load_custom_names(self, custom_names_file: str):
        """Load custom names from JSON"""
        try:
            with open(custom_names_file, 'r', encoding='utf-8') as f:
                names_data = json.load(f)
            
            # Handle list format: [{"name": "Name1", "sex": "male"}, ...]
            if isinstance(names_data, list):
                for name_item in names_data:
                    if isinstance(name_item, dict) and name_item.get('name'):
                        # Custom names go to Grills category (ID 94)
                        custom_entry = NameEntry(
                            name=name_item.get('name', ''),
                            sex=name_item.get('sex', 'male'),
                            popular=name_item.get('popular', False),
                            tags=name_item.get('tags', 'grills'),
                            category_ids={94}  # Grills category
                        )
                        self.custom_names.append(custom_entry)
            
            logger.info(f"Loaded {len(self.custom_names)} custom names")
            
        except Exception as e:
            logger.error(f"Failed to load custom names: {e}")
    
    def escape_sql_string(self, value: str) -> str:
        """Safely escape string for SQL"""
        if not value:
            return 'NULL'
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    
    def generate_sql(self, output_file: str):
        """Generate SQL file with all names and category relationships"""
        try:
            all_names = {}

            # Add original names first
            for name_key, name_entry in self.original_names.items():
                all_names[name_key] = name_entry

            # Add custom names with highest priority - merge with existing or add new
            for name_entry in self.custom_names:
                name_key = name_entry.name.lower()
                if name_key not in all_names:
                    # New custom name - add it
                    all_names[name_key] = name_entry
                    logger.info(f"Added new custom name: {name_entry.name}")
                else:
                    # Existing name - merge categories (add Grills category)
                    existing_entry = all_names[name_key]
                    existing_entry.category_ids.update(name_entry.category_ids)
                    # Update tags to include grills if not already there
                    if 'grills' not in existing_entry.tags:
                        existing_entry.tags = f"{existing_entry.tags}, grills" if existing_entry.tags else "grills"
                    logger.info(f"Updated existing name with Grills category: {name_entry.name}")
            
            logger.info(f"Generating SQL for {len(all_names)} total names")
            
            # Generate SQL
            sql_lines = []
            name_id = 0
            total_relationships = 0
            
            for name_key, name_entry in sorted(all_names.items()):
                popular = 'true' if name_entry.popular else 'false'
                tags = self.escape_sql_string(name_entry.tags)
                
                # Insert name
                sql_lines.append(
                    f"INSERT INTO names (id, name, sex, popular, tags) "
                    f"VALUES ({name_id}, '{name_entry.name}', '{name_entry.sex}', {popular}, {tags}) "
                    f"ON CONFLICT (name) DO NOTHING;"
                )
                
                # Insert name-category relationships
                for category_id in name_entry.category_ids:
                    sql_lines.append(
                        f"INSERT INTO name_categories (name_id, category_id) "
                        f"VALUES ({name_id}, {category_id}) "
                        f"ON CONFLICT (name_id, category_id) DO NOTHING;"
                    )
                    total_relationships += 1
                
                name_id += 1
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("-- Consolidated Names SQL with Category Relationships\n")
                f.write(f"-- Generated from raw data sources\n")
                f.write(f"-- Total names: {len(all_names)}\n")
                f.write(f"-- Original names: {len(self.original_names)}\n")
                f.write(f"-- Custom names: {len(self.custom_names)}\n")
                f.write(f"-- Category relationships: {total_relationships}\n\n")
                f.write('\n'.join(sql_lines))
            
            logger.info(f"Generated SQL file: {output_file}")
            logger.info(f"Total names: {len(all_names)}")
            logger.info(f"Category relationships: {total_relationships}")
            
        except Exception as e:
            logger.error(f"Failed to generate SQL: {e}")

def main():
    parser = argparse.ArgumentParser(description='Generate consolidated names SQL from raw data')
    parser.add_argument('--original', type=str, required=True,
                       help='Original names JSON file (scrapy consolidated.json)')
    parser.add_argument('--custom-names', type=str, required=True,
                       help='Custom names JSON file')
    parser.add_argument('--categories', type=str, required=True,
                       help='Categories JSON file')
    parser.add_argument('--output', type=str, default='consolidated_names.sql',
                       help='Output SQL file (default: consolidated_names.sql)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    generator = ConsolidatedNamesSQLGenerator()
    
    try:
        # Load categories first (needed for country mapping)
        generator.load_categories(args.categories)
        
        # Load original names
        generator.load_original_names(args.original)
        
        # Load custom names
        generator.load_custom_names(args.custom_names)
        
        # Generate SQL
        generator.generate_sql(args.output)
        
        print(f"Consolidated SQL file generated: {args.output}")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())