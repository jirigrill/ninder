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

    # Step 2: Create SQL script for creating table and inserting names
    insert_statements = [
        """
        CREATE TABLE IF NOT EXISTS names (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            meaning TEXT,
            UNIQUE (name)
        );

        CREATE TABLE IF NOT EXISTS name_categories (
            name_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (name_id, category_id),
            FOREIGN KEY (name_id) REFERENCES names(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );
        """
    ]

    # Step 3: Insert names and associate with categories
    category_id_map = {category["letterCode"]: idx for idx, category in enumerate(categories_data, start=1)}
    for idx, name_entry in enumerate(names_data, start=1):
        name = name_entry["name"].replace("'", "''")  # Escape single quotes
        meaning = name_entry["meaning"].replace("'", "''") if name_entry["meaning"] else 'NULL'
        insert_statements.append(
            f"INSERT INTO names (id, name, meaning) VALUES ({idx}, '{name}', '{meaning}') ON CONFLICT (name) DO NOTHING;"
        )
        for country in name_entry["countries"]:
            category_id = category_id_map.get(country)
            if category_id:
                insert_statements.append(
                    f"INSERT INTO name_categories (name_id, category_id) VALUES ({idx}, {category_id}) ON CONFLICT (name_id, category_id) DO NOTHING;"
                )

    # Output SQL script
    sql_script = "\n".join(insert_statements)
    with open('insert_categories.sql', 'w', encoding='utf-8') as output_file:
        output_file.write(sql_script)

    print("SQL script generated successfully.")

if __name__ == "__main__":
    main()
