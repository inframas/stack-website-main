from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB (adjust connection string as needed)
client = MongoClient('mongodb://inframas:!nfR4m4sT9cHn0logY4dm!nsYSt9mM0NG0@202.10.41.231:27017/?authMechanism=DEFAULT')
db = client['inframas']
collection = db['cards']

# Format the current UTC time in the desired format
# created_at = datetime.utcnow().isoformat()  # Format as ISO 8601 with 'Z'
created_at = datetime.utcnow()

# Define the document with the custom formatted created_at field
document = {
  "_id" : "0ddf88678949448388f72ee421311880",
  "name" : "Druid Gonestar",
  "description" : "Unbelivable robot that came from the middle of city in Megorame, became the strongest of his race",
  "element" : ["iron", "fire", "wind"],
  "health" : 43000,
  "attack" : 7000,
  "defense" : 2600,
  "rarity" : "rare",
  "price" : 1700,
    "created_at": created_at  # Custom formatted date string
}

# Insert the document into the collection
collection.insert_one(document)