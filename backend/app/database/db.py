import os

from pymongo import MongoClient
from dotenv import load_dotenv
import gridfs



load_dotenv()



MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")



client = MongoClient(MONGO_URI)



db = client[DATABASE_NAME]



fs = gridfs.GridFS(db)



users_collection = db["users"]
game_sessions_collection = db["game_sessions"]
game_results_collection = db["game_results"]
caregiver_patient_collection = db["caregiver_patient"]
reminders_collection = db["reminders"]

memory_gallery_collection = db["memory_gallery"]