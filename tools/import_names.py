import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firebase Admin SDK
with open("serviceAccountKey.json", "r", encoding="utf-8") as key_file:
    cred_data = json.load(key_file)
cred = credentials.Certificate(cred_data)
firebase_admin.initialize_app(cred)
db = firestore.client()

def import_json_to_firestore(json_file_path, collection_name):
    # Load JSON data
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Ensure data is a list of dictionaries
    if not isinstance(data, list):
        print(f"Error: JSON data in {json_file_path} must be a list of objects.")
        return

    # Import each item in JSON as a Firestore document
    for document in data:
        doc_ref = db.collection(collection_name).document(document["id"])

        # Check if document exists
        if doc_ref.get().exists:
            # Document exists, update it
            doc_ref.update(document)
            print(f"Updated document with ID: {document['id']} in {collection_name} collection.")
        else:
            # Document does not exist, set it (create new)
            doc_ref.set(document)
            print(f"Created document with ID: {document['id']} in {collection_name} collection.")

    print(f"Data import to {collection_name} complete.")

# Import names.json to the 'names' collection
import_json_to_firestore("names.json", "names")
