import json
from collections import defaultdict

def load_json_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        return json.load(file)

def main():
    # Load JSON files
    names_data = load_json_file('names.json')
    categories_data = load_json_file('categories.json')
    two_letter_code_map = load_json_file('twoLetterCodeMap.json')

    # Step 1: Group names by country
    country_name_count = defaultdict(int)
    for name_entry in names_data:
        for country in name_entry["countries"]:
            country_name_count[country] += 1

    # Step 2: Create SQL script for creating table and inserting categories
    insert_statements = [
        """
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            letter_code VARCHAR(10) NULL,
            total_cards INTEGER DEFAULT 0,
            visible BOOLEAN DEFAULT FALSE,
            UNIQUE (name, letter_code)
        );
        """
    ]

    for category in categories_data:
        letter_code = category["letterCode"]
        if category["name"] == "Gemischt":
            total_cards = len(names_data)  # All available names for 'Gemischt'
            visible = 'TRUE'  # Set 'Gemischt' category to visible
        else:
            total_cards = country_name_count.get(letter_code, 0)
            visible = 'TRUE' if letter_code else 'FALSE'
        country_name = two_letter_code_map.get(letter_code, category["name"])
        letter_code_value = 'NULL' if not letter_code else f"'{letter_code}'"
        insert_statements.append(
            f"INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('{country_name}', {letter_code_value}, {total_cards}, {visible}) ON CONFLICT (name, letter_code) DO NOTHING;"
        )

    # Step 3: Insert countries not present in categories.json
    existing_letter_codes = {category["letterCode"] for category in categories_data if category["letterCode"]}
    for letter_code, total_cards in country_name_count.items():
        if letter_code not in existing_letter_codes:
            country_name = two_letter_code_map.get(letter_code, letter_code)  # Get country name from map or use letter_code if not found
            letter_code_value = 'NULL' if not letter_code else f"'{letter_code}'"
            insert_statements.append(
                f"INSERT INTO categories (name, letter_code, total_cards, visible) VALUES ('{country_name}', {letter_code_value}, {total_cards}, FALSE) ON CONFLICT (name, letter_code) DO NOTHING;"
            )

    # Output SQL script
    sql_script = "\n".join(insert_statements)
    with open('insert_categories.sql', 'w', encoding='utf-8') as output_file:
        output_file.write(sql_script)

    print("SQL script generated successfully.")

if __name__ == "__main__":
    main()
