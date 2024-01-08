from datetime import datetime
import requests
from models.models import Event, SearchBody
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from db.database import get_collection
from db.database import get_database
from fastapi import BackgroundTasks
import os

router = APIRouter()
SEMANTIC_SCHOLAR_BASEURL="https://api.semanticscholar.org/graph/v1/paper"
FIELDS="title,publicationDate,journal,referenceCount,citationCount"
LIMIT=20
OFFSET=0

def transform_json(input_json):
    return {
        "paperId": input_json["paperId"],
        "title": input_json["title"],
        "publicationDate": input_json["publicationDate"],
        "referenceCount":input_json["referenceCount"],
        "citationCount":input_json["citationCount"],
        "journalName": input_json["journal"]["name"] if input_json.get("journal") is not None and input_json.get("journal").get("name") is not None else None
    }

def transform_event_json(event:Event):
    return {
        "positive":event.positive,
        "negative":event.negative,
        "badge":event.badge,
        "userId":event.userId,
        "paperId":event.paperId
    }

def convert_to_serializable(doc):
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, dict):
                # Recursive call for nested dictionary
                doc[key] = convert_to_serializable(value)
            elif isinstance(value, list):
                # Recursive call for each item in the list
                doc[key] = [convert_to_serializable(item) if isinstance(item, dict) else item for item in value]
    return doc


def save_to_mongodb(searchQuery,userId,responseData):
    # Logic to save data to MongoDB
    papers_collection = get_collection("papers")
    transformed_papers = [transform_json(paper) for paper in responseData]
    for data in transformed_papers:
        paperMongoQuery = {"paperId": data["paperId"]}
        paperMongoUpdate = {"$setOnInsert": data}
        papers_collection.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)

    paperIds = [paper.get("paperId") for paper in responseData]

    query_collection = get_collection("search_query")
    searchTermMongoQuery={"searchQuery":searchQuery,"userId":userId}
    searchTermMongoUpdate={"$setOnInsert":{"paperIds":paperIds,"timeStamp":datetime.now()}}
    query_collection.update_one(searchTermMongoQuery,searchTermMongoUpdate,upsert=True)

@router.post("/event",response_description="Record Paper Interaction")
async def record_event(request:Event):
    print(request)
    event_collection = get_collection("paper_user_events")
    searchTermMongoQuery={"paperId":request.paperId,"userId":request.userId}
    searchTermMongoUpdate={"$set":transform_event_json(request)}
    # print(searchTermMongoUpdate)
    event_collection.update_one(searchTermMongoQuery,searchTermMongoUpdate,upsert=True)
    return {"status":"updated"}
    


@router.post("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,request: SearchBody):
    print(request)
    SEARCH_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/search?fields={FIELDS}&query={request.query}&limit={LIMIT}&offset={OFFSET}'
    response = requests.get(SEARCH_URL)
    jsonResponse = response.json()
    background_tasks.add_task(save_to_mongodb,request.query,request.userId,jsonResponse["data"])
    return jsonResponse["data"]

@router.get("/userPaperHistory",response_description="Get Previous Searched Papers")
async def get_user_papers(userId:str):

    pipeline = [
        { "$match": { "userId": userId } },
        { "$sort": { "timeStamp": -1 } },
        {
            "$lookup": {
                "from": "papers",
                "localField": "paperIds",
                "foreignField": "paperId",
                "as": "joinedPapers"
            }
        },
        {
            "$lookup": {
                "from": "paper_user_events",
                "localField": "paperIds",
                "foreignField": "paperId",
                "as": "userEvents"
            }
        },
        {
            "$addFields": {
                "paperDetails": {
                    "$map": {
                        "input": "$paperIds",
                        "as": "paperId",
                        "in": {
                            "$mergeObjects": [
                                {
                                    "$first": {
                                        "$filter": {
                                            "input": "$joinedPapers",
                                            "as": "joinedPaper",
                                            "cond": { "$eq": ["$$joinedPaper.paperId", "$$paperId"] }
                                        }
                                    }
                                },
                                {
                                    "paperEvents": {
                                        "$first": {
                                            "$filter": {
                                                "input": "$userEvents",
                                                "as": "userEvent",
                                                "cond": { 
                                                    "$and": [
                                                        { "$eq": ["$$userEvent.paperId", "$$paperId"] },
                                                        { "$eq": ["$$userEvent.userId", userId] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        { "$project": { "joinedPapers": 0, "userEvents": 0 } }
    ]

    db = get_database()

    cursor = db.search_query.aggregate(pipeline)
    results = [convert_to_serializable(document) async for document in cursor]
    combinedPaperResults = []
    for result in results:
        combinedPaperResults.extend(result.get("paperDetails", []))    
    return combinedPaperResults
