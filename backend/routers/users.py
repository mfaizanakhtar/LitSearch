from fastapi import APIRouter

from backend.db import engine
from backend.models import UserModel


router = APIRouter()

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "image": user["image"],
        "userId": str(user["userId"]),
        "provider":user["provider"]
    }


@router.post("/loginUser", response_description="Add new user")
async def add_user(user: UserModel):
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

    return user_helper(new_user)
