import os

from pymongo import MongoClient
from dotenv import load_dotenv


# Load variables from .env
load_dotenv()


# Get MongoDB settings
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")


# Create MongoDB connection
client = MongoClient(MONGO_URI)


# Select our database
db = client[DATABASE_NAME]


# Select users collection
users_collection = db["users"]
game_sessions_collection = db["game_sessions"]
game_results_collection = db["game_results"]