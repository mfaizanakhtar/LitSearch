import time
import requests
from backend.util import convert_to_serializable
from backend.models import Event, EventRequest
from fastapi import APIRouter
from bson import ObjectId
from fastapi import BackgroundTasks
import requests
import time

from backend.db import engine

router = APIRouter()
SEMANTIC_SCHOLAR_BASEURL="https://api.semanticscholar.org/graph/v1/paper"
FIELDS="title,publicationDate,journal,referenceCount,citationCount,abstract,venue"
LIMIT=20
OFFSET=0
papers, eventlog, query_papers = engine["papers"], engine["events"], engine["query_papers"]


def transform_json(input):
    return dict(input, **{
        "journalName": input.get("journal", {}).get("name", None) if input.get("journal") else {}
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
def transform_event_json(event:Event):
    return {
        "positive":event.positive,
        "negative":event.negative,
        "badge":event.badge,
        "userId":event.userId,
        "paperId":event.paperId
    }


def save_search_to_mongodb(searchQuery,userId,responseData):
    # Logic to save data to MongoDB
    transformed_papers = [transform_json(paper) for paper in responseData]
    paperIds=[]
    for data in reversed(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"]}
        data["searchQuery"]=searchQuery

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
        paperIds.append({"paperId":data["paperId"],"index":time.time(),"paperEvents":{}})
    
    query_paperMongQuery = {"searchQuery":searchQuery,"userId":userId}
    query_paperMongoUpdate={"$setOnInsert":{"papers":paperIds,"index":time.time()}}
    query_papers.update_one(query_paperMongQuery,query_paperMongoUpdate,upsert=True)


@router.post("/event",response_description="Record Paper Interaction")
async def record_event(request:EventRequest,background_tasks:BackgroundTasks):
    searchTermMongoQuery={"papers.paperId":request.event.paperId,"userId":request.event.userId}
    updatedObject = transform_event_json(request.event)
    searchTermMongoUpdate={"$set":{ "papers.$[elem].paperEvents": updatedObject } }
    if(request.event.negative):
        updatedIndex=-999999999999+time.time()
        searchTermMongoUpdate["$set"]["papers.$[elem].index"]=updatedIndex
    arrayFilters = [{ "elem.paperId": request.event.paperId }]

    query_papers.update_one(searchTermMongoQuery,searchTermMongoUpdate,array_filters=arrayFilters)
    if(request.event.positive):
        relevantPapers = await fetch_references_citation(request.event.paperId)
        background_tasks.add_task(save_ref_citation_to_mongodb,request.event.paperId, request.event.userId, request.currentSearchQuery, relevantPapers)
        return {"status":"updated","relevantPapers":relevantPapers}
    return {"status":"updated"}
    

# @router.get("/getReferenceCitations",response_description="Get References and Citations")
async def fetch_references_citation(paperId:str):
    REFERENCES_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/references?fields={FIELDS}&offset=0&limit=10'
    CITATIONS_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/citations?fields={FIELDS}&offset=0&limit=10'
    referencesResp = requests.get(REFERENCES_URL).json()
    citationsResp = requests.get(CITATIONS_URL).json()

    simplified_paper_obj = [{**paper["citedPaper"], "parentId": paperId} for paper in referencesResp["data"]] + [{**paper["citingPaper"],"parentId":paperId} for paper in citationsResp["data"]]
    return simplified_paper_obj


async def save_ref_citation_to_mongodb(paperId,userId,searchQuery,responseData):
    # Logic to save data to MongoDB
    transformed_papers = [transform_json(paper) for paper in responseData]
    query_papers_relevant_array=[]
    for data in reversed(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"]}
        data["index"]=time.time()
        query_papers_relevant_array.append({"paperId":data["paperId"],"index":data["index"],"paperEvents":{}})

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
    found = await query_papers.find_one({"userId":userId,"searchQuery":searchQuery})
    if found:
       existing_papers = found["papers"]
       unique_entries = {paper['paperId']: paper for paper in existing_papers + query_papers_relevant_array}
       merged_papers = list(unique_entries.values())
       query_papers.update_one({"userId":userId,"searchQuery":searchQuery},
                            {"$set":{"papers":merged_papers}})
                            # {"$push":{"papers":{"$each":query_papers_relevant_array}}})

@router.get("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,query:str,userId:str,isExistingQuery:bool=False):
    query_papers_update_mongoQry=({"searchQuery":query,"userId":userId},{"$set":{"index":time.time()}})

    if(isExistingQuery): # to just update the timestamp to fetch latest search result
        background_tasks.add_task(query_papers.update_one,*query_papers_update_mongoQry)
        return
    
    searchResult = await query_papers.update_one(*query_papers_update_mongoQry)
    print(searchResult)
    print("search result printed")
    if(not searchResult.raw_result["n"]):
        SEARCH_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/search?fields={FIELDS}&query={query.replace(" ", "%20")}&limit={LIMIT}&offset={OFFSET}'
        response = requests.get(SEARCH_URL)
        jsonResponse = response.json()
        data = response.json()['data']
        background_tasks.add_task(save_search_to_mongodb, query, userId, data)
        response_body={"searchQuery":query,"papers":jsonResponse["data"]}
        return response_body
    else:
        return await get_query_paper_result(userId,query)
    
@router.get("/getAllSearchQueriesForUser",response_description="Get history of queries for user")
async def get_search_queries(userId:str):
    all_queries = query_papers.find({"userId":userId},{"searchQuery":1,"_id":0}).sort({"index":-1})
    query_results = [convert_to_serializable(queries) async for queries in all_queries]
    return query_results
    


@router.get("/userPaperHistory",response_description="Get Previous Searched Papers")
async def get_user_papers(userId:str):
    return await get_query_paper_result(userId)

async def get_query_paper_result(userId,searchQuery=None):
    filterObj = {"userId":userId}

    if(searchQuery is not None):
        filterObj["searchQuery"]=searchQuery
    query_paper_pipline=[
        {"$match":filterObj},
        {"$sort": {"index": -1}},  # Sorts documents by queryDate in descending order
        {"$limit": 1},  # Limits to the most recent document
        {"$unwind":"$papers"},
        {"$lookup":{
            "from":"papers",
            "localField":"papers.paperId",
            "foreignField":"paperId",
            "as":"paperDetails"
        }},
        { "$unwind": "$paperDetails" },
        { "$sort": { "papers.index": -1 } },  # Sorts the documents based on sNo within the papers
        { 
        "$group": {
            "_id": "$_id",
            "searchQuery": { "$first": "$searchQuery" },
            "papers": { "$push": {"$mergeObjects":["$paperDetails",{"paperEvents":"$papers.paperEvents"}]}}
        }
        }
    ]    
    query_papers_aggregated = query_papers.aggregate(query_paper_pipline)
    papers_results = [convert_to_serializable(papers) async for papers in query_papers_aggregated]
    if(len(papers_results)>0):
        return papers_results[0]
    else: return papers_results