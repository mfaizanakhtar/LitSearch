from fastapi import APIRouter, Request

from backend.db import engine
from backend.models import User
from backend.util import parse_mongo_dict


router = APIRouter()

@router.post("/loginUser", response_description="Add new user")
async def add_user(user: User):
    collection = engine["users"]
    query = {"userId": user.userId}
    update = {"$setOnInsert": user.dict()}  # Use $setOnInsert to only set these fields if it's a new document

    # Perform a find-and-update operation with upsert
    new_user = await collection.find_one_and_update(
        query, 
        update, 
        upsert=True, 
        return_document=True  # Return the document after the update
    )

    return parse_mongo_dict(new_user)
