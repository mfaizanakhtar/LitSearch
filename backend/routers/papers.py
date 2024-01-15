from fastapi import APIRouter
from bson import ObjectId
from fastapi import BackgroundTasks
import requests
import time

from backend.db import engine
from backend.models import Event, SearchBody


router = APIRouter()
SEMANTIC_SCHOLAR_BASEURL="https://api.semanticscholar.org/graph/v1/paper"
FIELDS="title,publicationDate,journal,referenceCount,citationCount,abstract,venue"
LIMIT=20
OFFSET=0
papers, eventlog = engine["papers"], engine["events"]


def transform_json(input):
    return dict(input, **{
        "journalName": input.get("journal", {}).get("name", None)
    })


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
    transformed_papers = [transform_json(paper) for paper in responseData]
    for index,data in enumerate(reversed(transformed_papers)):
        paperMongoQuery = {"paperId": data["paperId"],"userId":userId}
        data["sNo"]=time.time()+index
        data["searchQuery"]=searchQuery

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)

async def save_ref_citation_to_mongodb(paperId,userId,responseData):
    # Logic to save data to MongoDB
    transformed_papers = [transform_json(paper) for paper in responseData]
    relevant_papers_toreturn=[]
    for index,data in enumerate(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"],"userId":userId}
        data["parentId"]=paperId
        data["sNo"]=time.time()+index

        paperMongoUpdate = {"$setOnInsert": data}
        updateResp = await papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
        if(not updateResp.raw_result.get("updatedExisting",False)): relevant_papers_toreturn.insert(0,data)

    return relevant_papers_toreturn

@router.post("/event",response_description="Record Paper Interaction")
async def record_event(request:Event,background_tasks:BackgroundTasks):
    searchTermMongoQuery={"paperId":request.paperId,"userId":request.userId}
    updatedObject = request.dict()
    if(request.negative):
        updatedObject["sNo"]=-999999999999+time.time()
    searchTermMongoUpdate={"$set":updatedObject}
    eventlog.update_one(searchTermMongoQuery,searchTermMongoUpdate,upsert=True)
    if(request.positive):
        relevantPapers = await fetch_references_citation(request.paperId,request.userId,background_tasks)
        return {"status":"updated","relevantPapers":relevantPapers}
    return {"status":"updated"}
    

# @router.get("/getReferenceCitations",response_description="Get References and Citations")
async def fetch_references_citation(paperId:str,userId:str,background_tasks:BackgroundTasks):
    REFERENCES_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/references?fields={FIELDS}&offset=0&limit=10'
    CITATIONS_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/citations?fields={FIELDS}&offset=0&limit=10'
    referencesResp = requests.get(REFERENCES_URL).json()
    citationsResp = requests.get(CITATIONS_URL).json()

    # todo: background task?
    simplified_paper_obj = [{**paper["citedPaper"], "parentId": paperId} for paper in referencesResp["data"]] + [{**paper["citingPaper"],"parentId":paperId} for paper in citationsResp["data"]]
    return await save_ref_citation_to_mongodb(paperId, userId, simplified_paper_obj)


@router.post("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,request: SearchBody):
    SEARCH_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/search?fields={FIELDS}&query={request.query.replace(" ", "%20")}&limit={LIMIT}&offset={OFFSET}'
    response = requests.get(SEARCH_URL)
    data = response.json()['data']
    background_tasks.add_task(save_search_to_mongodb, request.query, request.userId, data)
    return data


@router.get("/userPaperHistory",response_description="Get Previous Searched Papers")
async def get_user_papers(userId: str):
    found = papers.find({"userId": userId}).sort("sNo", -1)
    return [convert_to_serializable(document) async for document in found]
