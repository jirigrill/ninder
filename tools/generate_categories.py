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

    insert_statements = []

    for category in categories_data:
        letter_code = category["letterCode"]
        total_cards = 0
        total_male_cards = 0
        total_female_cards = 0
        id = category["id"]
        if category["name"] == "Gemischt":
            total_cards = len(names_data)  # All available names for 'Gemischt'
            total_male_cards = len(list(filter(lambda x: x["sex"] in ["Männlich", "Unisex"], names_data)))
            total_female_cards = len(list(filter(lambda x: x["sex"] in ["Weiblich", "Unisex"], names_data)))
            visible = 'TRUE'  # Set 'Gemischt' category to visible
        else:
            total_cards = len(list(filter(lambda x: letter_code in x["countries"], names_data)))
            total_male_cards = len(list(filter(lambda x: letter_code in x["countries"] and x["sex"] in ["Männlich", "Unisex"], names_data)))
            total_female_cards = len(list(filter(lambda x: letter_code in x["countries"] and x["sex"] in ["Weiblich", "uniUnisexsex"], names_data)))
            visible = 'TRUE' if letter_code else 'FALSE'
        country_name = category["name"]
        letter_code_value = 'NULL' if not letter_code else f"'{letter_code}'"
        insert_statements.append(
            f"INSERT INTO categories (id, name, letter_code, total_cards, total_male_cards, total_female_cards, visible) VALUES ({id}, '{country_name}', {letter_code_value}, {total_cards}, {total_male_cards}, {total_female_cards}, {visible}) ON CONFLICT (name, letter_code) DO NOTHING;"
        )

    # Output SQL script
    sql_script = "\n".join(insert_statements)
    with open('generate_categories.sql', 'w', encoding='utf-8') as output_file:
        output_file.write(sql_script)

    print("SQL script generated successfully.")

if __name__ == "__main__":
    main()
