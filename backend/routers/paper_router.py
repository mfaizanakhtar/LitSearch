from datetime import datetime
import json
import time
import requests
from models.models import Event, RefCitationBody, SearchBody
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
FIELDS="title,publicationDate,journal,referenceCount,citationCount,abstract,venue"
LIMIT=20
OFFSET=0

def transform_json(input_json):
    return {
        "paperId": input_json["paperId"],
        "title": input_json["title"],
        "abstract" : input_json["abstract"],
        "publicationDate": input_json["publicationDate"],
        "referenceCount":input_json["referenceCount"],
        "citationCount":input_json["citationCount"],
        "venue":input_json["venue"],
        "journalName": input_json["journal"]["name"] if input_json.get("journal") is not None and input_json.get("journal").get("name") is not None else None
    }

def transform_event_json(event:Event):
    return {"paperEvents":{
        "positive":event.positive,
        "negative":event.negative,
        "badge":event.badge,
        "userId":event.userId,
        "paperId":event.paperId
    }}

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


def save_search_to_mongodb(searchQuery,userId,responseData):
    # Logic to save data to MongoDB
    papers_collection = get_collection("papers")
    transformed_papers = [transform_json(paper) for paper in responseData]
    for index,data in enumerate(reversed(transformed_papers)):
        paperMongoQuery = {"paperId": data["paperId"],"userId":userId}
        data["sNo"]=time.time()+index
        data["searchQuery"]=searchQuery

        paperMongoUpdate = {"$setOnInsert": data}
        papers_collection.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)

async def save_ref_citation_to_mongodb(paperId,userId,responseData):
    # Logic to save data to MongoDB
    papers_collection = get_collection("papers")
    transformed_papers = [transform_json(paper) for paper in responseData]
    relevant_papers_toreturn=[]
    for index,data in enumerate(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"],"userId":userId}
        data["parentId"]=paperId
        data["sNo"]=time.time()+index

        paperMongoUpdate = {"$setOnInsert": data}
        updateResp = await papers_collection.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
        if(not updateResp.raw_result.get("updatedExisting",False)): relevant_papers_toreturn.insert(0,data)

    return relevant_papers_toreturn

@router.post("/event",response_description="Record Paper Interaction")
async def record_event(request:Event,background_tasks:BackgroundTasks):
    event_collection = get_collection("papers")
    searchTermMongoQuery={"paperId":request.paperId,"userId":request.userId}
    updatedObject = transform_event_json(request)
    if(request.negative):
        updatedObject["sNo"]=-999999999999+time.time()
    searchTermMongoUpdate={"$set":updatedObject}
    event_collection.update_one(searchTermMongoQuery,searchTermMongoUpdate,upsert=True)
    if(request.positive):
        relevantPapers = await fetch_references_citation(request.paperId,request.userId,background_tasks)
        return {"status":"updated","relevantPapers":relevantPapers}
    return {"status":"updated"}
    

# @router.get("/getReferenceCitations",response_description="Get References and Citations")
async def fetch_references_citation(paperId:str,userId:str,background_tasks:BackgroundTasks):
    print("req printed")
    REFERENCES_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/references?fields={FIELDS}&offset=0&limit=10'
    CITATIONS_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/citations?fields={FIELDS}&offset=0&limit=10'
    referencesResp = requests.get(REFERENCES_URL).json()
    citationsResp = requests.get(CITATIONS_URL).json()

    simplified_paper_obj = [{**paper["citedPaper"],"parentId":paperId} for paper in referencesResp["data"]] + [{**paper["citingPaper"],"parentId":paperId} for paper in citationsResp["data"]]
    relevant_papers_toreturn = await save_ref_citation_to_mongodb(paperId,userId,simplified_paper_obj)

    # background_tasks.add_task(save_ref_citation_to_mongodb,paperId,userId,simplified_paper_obj)
    return relevant_papers_toreturn


@router.post("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,request: SearchBody):
    print(request)
    SEARCH_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/search?fields={FIELDS}&query={request.query}&limit={LIMIT}&offset={OFFSET}'
    response = requests.get(SEARCH_URL)
    jsonResponse = response.json()
    background_tasks.add_task(save_search_to_mongodb,request.query,request.userId,jsonResponse["data"])
    return jsonResponse["data"]

@router.get("/userPaperHistory",response_description="Get Previous Searched Papers")
async def get_user_papers(userId:str):
    papers_collection = get_collection("papers")
    searchQuery = {"userId":userId}
    papers_searched = papers_collection.find(searchQuery).sort("sNo",-1)

    results = [convert_to_serializable(document) async for document in papers_searched]

    return results
