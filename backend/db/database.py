# db/database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.litSearch

def database_setup():
    collection = database["papers"]
    collection.create_index([("paperId",1)], unique=True)

    collection = database["users"]
    collection.create_index([("userId", 1)], unique=True)

    collection = database["query_papers"]
    collection.create_index([("searchQuery", 1),("userId",1)], unique=True)

def get_collection(collection_name: str):
    return database.get_collection(collection_name)

def get_database():
    return database
