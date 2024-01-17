from pydantic import BaseModel


class UserModel(BaseModel):
    name: str
    email: str
    image: str
    userId: str
    provider: str

class RefCitationBody(BaseModel):
    paperId: str
    userId: str

class Event(BaseModel):
    positive: bool = False
    negative: bool = False
    badge: str = ""
    paperId: str
    userId: str

class EventRequest(BaseModel):
    event:Event
    currentSearchQuery:str