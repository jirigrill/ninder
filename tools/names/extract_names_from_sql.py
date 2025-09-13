#!/usr/bin/env python3
"""
Extract Names from SQL Script

Parses INSERT statements from SQL files and extracts names into JSON format.
"""

import json
import argparse
import logging
import re
from typing import List, Dict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_sql_names(sql_file: str) -> List[Dict]:
    """Extract names from SQL INSERT statements"""
    names = []
    
    try:
        with open(sql_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match INSERT INTO names statements
        # Example: INSERT INTO names (id, name, sex, popular, tags) VALUES (1, 'John', 'male', true, 'popular');
        name_pattern = re.compile(
            r"INSERT INTO names \([^)]+\) VALUES \(([^)]+)\)",
            re.IGNORECASE | re.MULTILINE
        )
        
        for match in name_pattern.finditer(content):
            values_str = match.group(1)
            
            # Split by comma but handle quoted strings properly
            values = []
            current_value = ""
            in_quotes = False
            quote_char = None
            
            for char in values_str:
                if char in ("'", '"') and not in_quotes:
                    in_quotes = True
                    quote_char = char
                elif char == quote_char and in_quotes:
                    in_quotes = False
                    quote_char = None
                elif char == ',' and not in_quotes:
                    values.append(current_value.strip())
                    current_value = ""
                    continue
                
                current_value += char
            
            # Add the last value
            values.append(current_value.strip())
            
            # Clean up values (remove quotes)
            cleaned_values = []
            for val in values:
                val = val.strip()
                if val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                elif val.startswith('"') and val.endswith('"'):
                    val = val[1:-1]
                cleaned_values.append(val)
            
            # Extract name information
            if len(cleaned_values) >= 5:
                try:
                    name_id = int(cleaned_values[0])
                    name = cleaned_values[1]
                    sex = cleaned_values[2] if len(cleaned_values) > 2 else 'male'
                    popular_str = cleaned_values[3] if len(cleaned_values) > 3 else 'false'
                    tags = cleaned_values[4] if len(cleaned_values) > 4 else ''
                    
                    # Convert popular to boolean
                    popular = popular_str.lower() in ('true', '1', 'yes')
                    
                    # Skip if name is empty
                    if not name:
                        continue
                    
                    name_entry = {
                        "name": name,
                        "sex": sex,
                        "popular": popular
                    }
                    
                    if tags:
                        name_entry["tags"] = tags
                    
                    names.append(name_entry)
                    
                except (ValueError, IndexError) as e:
                    logger.warning(f"Skipping malformed entry: {values_str[:50]}... Error: {e}")
                    continue
        
        logger.info(f"Extracted {len(names)} names from SQL file")
        return names
        
    except Exception as e:
        logger.error(f"Failed to parse SQL file: {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description='Extract names from SQL file to JSON')
    parser.add_argument('sql_file', help='Input SQL file to parse')
    parser.add_argument('--output', '-o', type=str, default='original_names.json',
                       help='Output JSON file (default: original_names.json)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    try:
        # Parse names from SQL
        names = parse_sql_names(args.sql_file)
        
        if not names:
            logger.error("No names extracted from SQL file")
            return 1
        
        # Write to JSON file
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(names, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Successfully extracted {len(names)} names to {args.output}")
        print(f"Extracted {len(names)} names to {args.output}")
        
        # Show some sample names
        print("\nSample extracted names:")
        for i, name in enumerate(names[:5]):
            print(f"  {name}")
        
        if len(names) > 5:
            print(f"  ... and {len(names) - 5} more")
        
        return 0
        
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        return 1

if __name__ == "__main__":
    exit(main())