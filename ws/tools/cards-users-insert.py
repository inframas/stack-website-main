from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB (adjust connection string as needed)
client = MongoClient('mongodb://inframas:!nfR4m4sT9cHn0logY4dm!nsYSt9mM0NG0@202.10.41.231:27017/?authMechanism=DEFAULT')
db = client['inframas']
collection = db['users-cards']

# Format the current UTC time in the desired format
# created_at = datetime.utcnow().isoformat()  # Format as ISO 8601 with 'Z'
created_at = datetime.utcnow()

# Define the document with the custom formatted created_at field
document = {
  "_id" : "a2a6f6a222d24c5fa56b5bda9fa4eb9b",
  "users_id" : "ajsdfj0ja09djsf90ajsdf9",
  "cards_id" : "oo093j1848j910834c90134",
  "owned_since" : created_at,
  "card_release_number" : 1,
  "created_at" : created_at
}

# Insert the document into the collection
collection.insert_one(document)