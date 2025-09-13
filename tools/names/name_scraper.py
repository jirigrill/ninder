#!/usr/bin/env python3
"""
BehindTheName.com Respectful Web Scraper

This script scrapes name meanings and descriptions from behindthename.com
with proper rate limiting and respect for robots.txt.

Usage: python name_scraper.py [--limit 100] [--delay 2.0]
"""

import requests
import time
import re
import psycopg2
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, quote
from bs4 import BeautifulSoup
import argparse
import logging
from typing import Optional, Dict, List
import random
from dataclasses import dataclass

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class NameInfo:
    name: str
    meaning: Optional[str] = None
    description: Optional[str] = None
    origin: Optional[str] = None

class BehindTheNameScraper:
    def __init__(self, delay_range=(1.0, 3.0), user_agent=None):
        self.base_url = "https://www.behindthename.com"
        self.delay_range = delay_range
        self.session = requests.Session()
        
        # Set a respectful user agent
        self.session.headers.update({
            'User-Agent': user_agent or 'Ninder Name Research Bot 1.0 (Educational Purpose)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Check robots.txt
        self.check_robots_txt()
    
    def check_robots_txt(self):
        """Check if we're allowed to scrape according to robots.txt"""
        try:
            robots_url = urljoin(self.base_url, '/robots.txt')
            rp = RobotFileParser()
            rp.set_url(robots_url)
            rp.read()
            
            user_agent = self.session.headers.get('User-Agent', '*')
            if not rp.can_fetch(user_agent, self.base_url + '/name/'):
                logger.warning("robots.txt disallows crawling /name/ paths")
                # Continue anyway but be extra respectful with delays
                self.delay_range = (3.0, 6.0)
            else:
                logger.info("robots.txt allows crawling")
        except Exception as e:
            logger.warning(f"Could not read robots.txt: {e}")
    
    def respectful_delay(self):
        """Random delay between requests to be respectful"""
        delay = random.uniform(*self.delay_range)
        logger.debug(f"Waiting {delay:.1f} seconds...")
        time.sleep(delay)
    
    def get_name_info(self, name: str) -> Optional[NameInfo]:
        """Scrape information for a specific name"""
        try:
            logger.info(f"Fetching info for: {name}")
            
            # Try the submitted names section first (more detailed)
            url = f"{self.base_url}/name/{quote(name.lower())}/submitted"
            response = self.session.get(url, timeout=10)
            
            name_info = None
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                name_info = self.parse_name_page(soup, name)
            
            # If no info found or submitted page failed, try the main page
            if not name_info:
                url = f"{self.base_url}/name/{quote(name.lower())}"
                response = self.session.get(url, timeout=10)
                
                if response.status_code != 200:
                    logger.warning(f"Failed to fetch {name}: HTTP {response.status_code}")
                    return None
                
                soup = BeautifulSoup(response.content, 'html.parser')
                name_info = self.parse_name_page(soup, name)
            
            return name_info
            
        except requests.RequestException as e:
            logger.error(f"Request failed for {name}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error for {name}: {e}")
            return None
    
    def parse_name_page(self, soup: BeautifulSoup, name: str) -> Optional[NameInfo]:
        """Parse the name information from the page"""
        info = NameInfo(name=name)
        
        try:
            # Look for the meaning section - check multiple possible structures
            meaning_text = ""
            
            # Method 1: Look for "Meaning & History" heading and following content
            meaning_heading = soup.find(['h1', 'h2', 'h3'], string=re.compile(r'Meaning\s*&?\s*History', re.IGNORECASE))
            if meaning_heading:
                # Get the parent section that contains the meaning
                section = meaning_heading.find_parent('section')
                if section:
                    # Get all text from the section but skip the heading and "Expand Links"
                    section_text = section.get_text()
                    # Remove the heading text and "Expand Links"
                    clean_text = section_text.replace(meaning_heading.get_text(), '').replace('Expand Links', '').strip()
                    if clean_text and len(clean_text) > 10:
                        meaning_text = clean_text
            
            # Method 2: Look for div with class 'namesummary' (fallback)
            if not meaning_text:
                meaning_div = soup.find('div', class_='namesummary')
                if meaning_div:
                    meaning_text = meaning_div.get_text(strip=True)
            
            # Method 3: Look for section containing meaning content
            if not meaning_text:
                sections = soup.find_all('section')
                for section in sections:
                    section_text = section.get_text()
                    if 'meaning' in section_text.lower() or 'derived' in section_text.lower():
                        # Extract paragraphs from this section
                        paragraphs = section.find_all('p')
                        if paragraphs:
                            meaning_text = ' '.join([p.get_text(strip=True) for p in paragraphs])
                        break
            
            if meaning_text:
                info.meaning = meaning_text[:500]  # Limit length
                info.description = meaning_text[:2000]  # Use same content for description
            
            # Look for origin information more precisely
            if meaning_text:
                # Extract origin from the meaning text itself
                origin_patterns = [
                    re.compile(r'([A-Z][a-z]+(?:\s+[a-z]+)?\s+(?:form|variant|diminutive)\s+of\s+[A-Za-z]+)', re.IGNORECASE),
                    re.compile(r'(From\s+(?:the\s+)?[A-Z][a-z]+(?:\s+[a-z]+)*)', re.IGNORECASE),
                    re.compile(r'(Derived\s+from\s+[A-Z][a-z]+(?:\s+[a-z]+)*)', re.IGNORECASE)
                ]
                
                for pattern in origin_patterns:
                    origin_match = pattern.search(meaning_text)
                    if origin_match:
                        info.origin = origin_match.group(1).strip()
                        break
                
                # If no specific origin pattern found, try to extract a short descriptive phrase
                if not info.origin:
                    sentences = meaning_text.split('.')
                    if sentences:
                        first_sentence = sentences[0].strip()
                        if len(first_sentence) < 100:  # Keep it short
                            info.origin = first_sentence
            
            # Only return if we found meaningful information
            if info.meaning or info.description or info.origin:
                logger.info(f"✓ Found info for {name}")
                return info
            else:
                logger.warning(f"No meaningful info found for {name}")
                return None
                
        except Exception as e:
            logger.error(f"Error parsing page for {name}: {e}")
            return None

class DatabaseManager:
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
    
    def get_names_to_scrape(self, limit: int = None) -> List[str]:
        """Get names from database that don't have meaning/description yet"""
        try:
            cursor = self.conn.cursor()
            query = """
                SELECT name 
                FROM names 
                WHERE (
                    (meaning IS NULL OR meaning = '') 
                    OR scraped_at IS NULL
                )
                AND name ~ '^[A-Za-z]+$'  -- Only alphabetic names
                GROUP BY name, popular
                ORDER BY popular DESC, name
            """
            
            if limit:
                query += f" LIMIT {limit}"
            
            cursor.execute(query)
            names = [row[0] for row in cursor.fetchall()]
            cursor.close()
            
            logger.info(f"Found {len(names)} names that need scraping")
            return names
            
        except Exception as e:
            logger.error(f"Database query failed: {e}")
            return []
    
    def update_name_info(self, info: NameInfo):
        """Update name information in the database (only updates empty fields)"""
        try:
            cursor = self.conn.cursor()
            
            # Only update fields that are currently NULL or empty
            cursor.execute("""
                UPDATE names 
                SET meaning = CASE 
                    WHEN (meaning IS NULL OR meaning = '') AND %s IS NOT NULL THEN %s 
                    ELSE meaning 
                END,
                description = CASE 
                    WHEN (description IS NULL OR description = '') AND %s IS NOT NULL THEN %s 
                    ELSE description 
                END,
                origin = CASE 
                    WHEN (origin IS NULL OR origin = '') AND %s IS NOT NULL THEN %s 
                    ELSE origin 
                END,
                scraped_at = CASE 
                    WHEN (meaning IS NULL OR meaning = '' OR description IS NULL OR description = '' OR origin IS NULL OR origin = '') 
                    THEN NOW() 
                    ELSE scraped_at 
                END
                WHERE LOWER(name) = LOWER(%s)
                AND (
                    (meaning IS NULL OR meaning = '') 
                    OR (description IS NULL OR description = '') 
                    OR (origin IS NULL OR origin = '')
                )
            """, (
                info.meaning, info.meaning,      # meaning
                info.description, info.description,  # description  
                info.origin, info.origin,        # origin
                info.name                        # where clause
            ))
            
            if cursor.rowcount > 0:
                logger.info(f"✓ Updated database for {info.name}")
            else:
                logger.info(f"⏭ Skipped {info.name} (already has complete data)")
            
            cursor.close()
            
        except Exception as e:
            logger.error(f"Database update failed for {info.name}: {e}")
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")

def main():
    parser = argparse.ArgumentParser(description='Scrape name meanings from BehindTheName.com')
    parser.add_argument('--limit', type=int, default=None, help='Maximum names to scrape (default: no limit)')
    parser.add_argument('--delay', type=float, nargs=2, default=[1.5, 3.0], 
                       help='Delay range between requests (min max)')
    parser.add_argument('--db-url', type=str, 
                       default='postgresql://ninder_user:your_secure_password_change_me@localhost:5432/ninder',
                       help='Database connection URL')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Initialize components
    logger.info("Starting BehindTheName scraper...")
    scraper = BehindTheNameScraper(delay_range=tuple(args.delay))
    db = DatabaseManager(args.db_url)
    
    try:
        # Get names to scrape
        names = db.get_names_to_scrape(args.limit)
        
        if not names:
            logger.info("No names found that need scraping")
            return
        
        logger.info(f"Starting to scrape {len(names)} names...")
        
        # Process each name
        success_count = 0
        for i, name in enumerate(names, 1):
            logger.info(f"Progress: {i}/{len(names)} - Processing: {name}")
            
            # Scrape the name
            name_info = scraper.get_name_info(name)
            
            if name_info:
                # Update database
                db.update_name_info(name_info)
                success_count += 1
            
            # Be respectful with delays
            if i < len(names):  # Don't delay after the last name
                scraper.respectful_delay()
        
        logger.info(f"Scraping completed! Successfully processed {success_count}/{len(names)} names")
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()