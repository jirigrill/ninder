import json
from collections import defaultdict

def load_json_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        return json.load(file)

def main():
    # Load JSON files
    names_data = load_json_file('.\scrapy\post-process.json')
    categories_data = load_json_file('categories.json')
 
    # Step 1: Group names by country
    country_name_count = defaultdict(int)
    for name_entry in names_data:
        for country in name_entry["countries"]:
            country_name_count[country] += 1

    # Step 2: Create SQL script for creating table and inserting names
    insert_statements = []

    # Step 3: Insert names and associate with categories
    category_id_map = {category["letterCode"]: idx for idx, category in enumerate(categories_data, start=1)}
    for idx, name_entry in enumerate(names_data, start=1):
        name = name_entry["name"].replace("'", "''")  # Escape single quotes
        sex = name_entry["sex"].replace("'", "''")
        popular = name_entry["popular"]
        insert_statements.append(
            f"INSERT INTO names (id, name, sex, popular) VALUES ({idx}, '{name}', '{sex}', '{popular}') ON CONFLICT (name) DO NOTHING;"
        )
        for country in name_entry["countries"]:
            category_id = category_id_map.get(country)
            if category_id:
                insert_statements.append(
                    f"INSERT INTO name_categories (name_id, category_id) VALUES ({idx}, {category_id}) ON CONFLICT (name_id, category_id) DO NOTHING;"
                )

    # Output SQL script
    sql_script = "\n".join(insert_statements)
    with open('generate_names.sql', 'w', encoding='utf-8') as output_file:
        output_file.write(sql_script)

    print("SQL script generated successfully.")

if __name__ == "__main__":
    main()
