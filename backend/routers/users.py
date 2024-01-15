from fastapi import APIRouter

from backend.db import engine
from backend.models import UserModel


router = APIRouter()


def to_dict(user) -> dict:
    return dict(user, **{
        "id": str(user["_id"]),
        "userId": str(user["userId"]),
    })


@router.post("/loginUser", response_description="Add new user")
async def add_user(user: UserModel):
    collection = engine["users"]
    found = await collection.find_one({"userId": user.userId})
    if found:
        return to_dict(found)
    user = await collection.insert_one(user.dict())
    return dict(user.dict(), **{"_id": user.inserted_id})