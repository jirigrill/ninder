import json

# Load JSON data from files
with open('names.json', 'r', encoding='utf-8') as names_file:
    names = json.load(names_file)

with open('categories.json', 'r', encoding='utf-8') as categories_file:
    categories = json.load(categories_file)

# Update totalCards for each category based on letterCode in names.countries
for category in categories:
    if category['name'].lower() == "gemischt":
        # For the "gemischt" category, include all names
        category['totalCards'] = len(names)
    else:
        # Filter names that include the category's letterCode in their countries
        letter_code = category['letterCode']
        category['totalCards'] = sum(1 for name in names if letter_code in name['countries'])

# Save updated categories back to categories.json
with open('categories.json', 'w', encoding='utf-8') as categories_file:
    json.dump(categories, categories_file, ensure_ascii=False, indent=4)

print("Updated categories with totalCards counts.")
