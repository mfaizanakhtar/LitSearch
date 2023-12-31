from pydantic import BaseModel

# Pydantic model for user data
class UserModel(BaseModel):
    name: str
    email: str
    image: str
    userId:str
    provider:str

class SearchBody(BaseModel):
    query: str
    userId: str

class Event(BaseModel):
    positive:bool=False
    negative:bool=False
    badge:str=""
    paperId:str
    userId:str