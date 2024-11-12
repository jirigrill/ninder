import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firebase Admin SDK
with open("serviceAccountKey.json", "r", encoding="utf-8") as key_file:
    cred_data = json.load(key_file)
cred = credentials.Certificate(cred_data)
firebase_admin.initialize_app(cred)
db = firestore.client()

def delete_entire_collection(collection_name):
    try:
        # Delete the entire collection
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()
        for doc in docs:
            doc.reference.delete()
            print(f"Deleted document with ID: {doc.id} from collection {collection_name}")

        print(f"Collection {collection_name} deleted successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Delete 'categories' collection
delete_entire_collection("categories")

# Delete collections starting with 'names_'
collections = db.collections()
for collection in collections:
    if collection.id.startswith("names_"):
        delete_entire_collection(collection.id)
