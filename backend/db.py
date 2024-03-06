# db/database.py
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URI")
print(MONGO_DETAILS)

client = AsyncIOMotorClient(MONGO_DETAILS)
engine = client.litSearch

# def database_setup():
#     collection = database["papers"]
#     collection.create_index([("paperId",1)], unique=True)

#     collection = database["users"]
#     collection.create_index([("userId", 1)], unique=True)

#     collection = database["query_papers"]
#     collection.create_index([("searchQuery", 1),("userId",1)], unique=True)