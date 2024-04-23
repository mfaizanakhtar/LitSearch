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
    paperId:str
    userId: uuid
    type: str
    data: Any
    query:str

class Project(BaseModel):
    name:str
    desc:str
    userId:str

class PaperProject(BaseModel):
    projectId:str
    paperId:str
    userId:str

class QueryProject(BaseModel):
    projectId:str
    queryId:str
    searchTerm:str
    userId:str

class AddUserToProject(BaseModel):
    user:str
    projectName:str


# class EventRequest(BaseModel):
#     event:Event
#     currentSearchQuery:str


# class Search(BaseModel):
#     userId: uuid
#     query: str


# class Citation(BaseModel):
#     paperId: uuid
#     cites: List[uuid]
