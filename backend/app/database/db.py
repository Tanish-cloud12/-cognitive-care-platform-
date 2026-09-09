import os

from pymongo import MongoClient
from dotenv import load_dotenv
import gridfs


# Load variables from .env
load_dotenv()


# Get MongoDB settings
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")


# Connect to MongoDB
client = MongoClient(MONGO_URI)


# Select our database
db = client[DATABASE_NAME]


# GridFS for storing memory gallery images
fs = gridfs.GridFS(db)


# Select collections
users_collection = db["users"]
game_sessions_collection = db["game_sessions"]
game_results_collection = db["game_results"]
caregiver_patient_collection = db["caregiver_patient"]
reminders_collection = db["reminders"]

memory_gallery_collection = db["memory_gallery"]