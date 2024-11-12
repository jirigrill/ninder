import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firebase Admin SDK
with open("serviceAccountKey.json", "r", encoding="utf-8") as key_file:
    cred_data = json.load(key_file)
cred = credentials.Certificate(cred_data)
firebase_admin.initialize_app(cred)
db = firestore.client()

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

    # Sort names_data by 'id'
    names_data.sort(key=lambda x: x["id"])

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
