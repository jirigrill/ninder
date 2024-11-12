import firebase_admin
from firebase_admin import credentials, firestore
import json
from collections import defaultdict

# Initialize Firebase Admin SDK
with open("serviceAccountKey.json", "r", encoding="utf-8") as key_file:
    cred_data = json.load(key_file)
cred = credentials.Certificate(cred_data)
firebase_admin.initialize_app(cred)
db = firestore.client()

def load_names_count_by_country(json_file_path):
    # Load names data and count occurrences of each country code
    with open(json_file_path, 'r', encoding='utf-8') as file:
        names_data = json.load(file)
    
    # Initialize a dictionary to count occurrences by country code
    country_counts = defaultdict(int)
    total_names_count = 0

    for name in names_data:
        total_names_count += 1
        for country_code in name["countries"]:
            country_counts[country_code] += 1
    
    return country_counts, total_names_count

def update_categories_total_cards(json_file_path, country_counts, total_names_count):
    # Load categories data
    with open(json_file_path, 'r', encoding='utf-8') as file:
        categories_data = json.load(file)
    
    # Update each category with the corresponding totalCards count
    for category in categories_data:
        letter_code = category.get("letterCode")
        # Use specific count or total count if letterCode is null
        total_cards = country_counts.get(letter_code, total_names_count if letter_code is None else 0)

        # Update or set the document in Firestore
        doc_ref = db.collection("categories").document(category["id"])
        if doc_ref.get().exists:
            doc_ref.update({"totalCards": total_cards})
            print(f"Updated category {category['name']} with totalCards: {total_cards}")
        else:
            # If the document doesn't exist, create it with totalCards field
            category["totalCards"] = total_cards
            doc_ref.set(category)
            print(f"Created category {category['name']} with totalCards: {total_cards}")

    print("Categories totalCards update complete.")

# Load country counts from names.json
country_counts, total_names_count = load_names_count_by_country("names.json")

# Update categories totalCards based on counts
update_categories_total_cards("categories.json", country_counts, total_names_count)
