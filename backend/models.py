from pydantic import BaseModel
from typing import Dict, List, Any

uuid = str

class User(BaseModel):
    name: str
    email: str
    image: str
    userId: uuid
    provider: str


# class Event(BaseModel):
#     positive: bool = False
#     negative: bool = False
#     badge: str = ""
#     paperId: str
#     userId: str


class Event(BaseModel):
    userId: uuid
    type: str
    data: Dict[str, Any]


class EventRequest(BaseModel):
    event:Event
    currentSearchQuery:str


class Search(BaseModel):
    userId: uuid
    query: str


class Citation(BaseModel):
    paperId: uuid
    cites: List[uuid]
