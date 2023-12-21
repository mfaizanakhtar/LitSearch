from models.models import UserModel
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from db.database import get_collection
import os

router = APIRouter()

# Helper function for parsing user data from MongoDB
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
    user_collection = get_collection("users")
    findUser = await user_collection.find_one({"userId":user.userId})
    if(findUser is not None):
        return user_helper(findUser)
    user = await user_collection.insert_one(user.dict())
    new_user = await user_collection.find_one({"_id": user.inserted_id})
    return user_helper(new_user)


# @router.get("/")
# async def read_root():
#     return {"Hello": "World"}
