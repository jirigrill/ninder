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
    # Load names data and count occurrences of each root country code
    with open(json_file_path, 'r', encoding='utf-8') as file:
        names_data = json.load(file)

    # Initialize a dictionary to count occurrences by root country code
    country_counts = defaultdict(int)
    total_names_count = 0
    processed_names = set()

    for name in names_data:
        root_country = name.get("rootCountry")
        name_value = name.get("name")
        if root_country and name_value not in processed_names:
            total_names_count += 1
            country_counts[root_country] += 1
            processed_names.add(name_value)

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

def import_json_to_firestore(names_json_file_path, categories_json_file_path):
    # Load JSON data
    with open(names_json_file_path, 'r', encoding='utf-8') as file:
        names_data = json.load(file)

    with open(categories_json_file_path, 'r', encoding='utf-8') as file:
        categories_data = json.load(file)

    # Ensure data is a list of dictionaries
    if not isinstance(names_data, list):
        print(f"Error: JSON data in {names_json_file_path} must be a list of objects.")
        return

    if not isinstance(categories_data, list):
        print(f"Error: JSON data in {categories_json_file_path} must be a list of objects.")
        return

    # Extract valid country codes from categories
    valid_country_codes = {category["letterCode"] for category in categories_data}

    batch_max_size = 500  # Firestore batch limit
    processed_names = set()  # To track and remove duplicate names

    try:
        batch = db.batch()
        batch_size = 0

        # Import each item in JSON as a Firestore document
        for document in names_data:
            root_country = document.get("rootCountry")
            name = document.get("name")

            if name in processed_names:
                continue

            # Add to "Gemischt" collection (Mixed collection)
            gemischt_ref = db.collection("names_Gemischt").document(document["id"])
            batch.set(gemischt_ref, document)
            processed_names.add(name)
            batch_size += 1

            # Only add to country-specific collection if the rootCountry is in the valid list
            if root_country in valid_country_codes:
                country_collection = f"names_{root_country}"
                doc_ref = db.collection(country_collection).document(document["id"])

                # Check if document exists, create if not
                if not doc_ref.get().exists:
                    batch.set(doc_ref, document)
                    batch_size += 1

            # Commit batch if it reaches the maximum size
            if batch_size >= batch_max_size:
                batch.commit()
                print(f"Committed a batch of {batch_size} write operations.")
                batch = db.batch()
                batch_size = 0

        # Commit any remaining documents in the batch
        if batch_size > 0:
            batch.commit()
            print(f"Committed a final batch of {batch_size} write operations.")

        print(f"Data import complete.")

    except Exception as e:
        print(f"An error occurred: {e}")

# Import names.json, creating collections based on rootCountry and Gemischt
import_json_to_firestore("names.json", "categories.json")
