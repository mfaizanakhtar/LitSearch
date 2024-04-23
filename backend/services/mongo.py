import time
from backend.util import convert_to_serializable, transform_paper_json
from backend.db import engine

papers, eventlog, queries, projects = engine["papers"], engine["events"], engine["queries"] , engine["projects"]

async def save_search_result(query,userId,responseData,queryId):
    # Logic to save data to MongoDB
    transformed_papers = [transform_paper_json(paper) for paper in responseData]
    paperIds=[]
    for data in reversed(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"]}
        data["query"]=query

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
        paperIds.append({"paperId":data["paperId"],"index":time.time()})
    
    await queries.insert_one({"_id":queryId,"query":query,"userId":userId,"papers":paperIds,"index":time.time()})
    await create_project_and_save_query(query,userId,queryId)

async def create_project_and_save_query(query,userId,queryId):
    found = await projects.find_one({"name":query,"team":{"$elemMatch":{"userId":userId}}})
    if not found:
            await projects.insert_one({
                "name":query,
                "team":[{"userId":userId,"role":"owner"}],
                "papers":[],
                "queries":[{"queryId":str(queryId),"searchTerm":query}]
            })


async def save_ref_citation(userId,query,responseData):
    # Logic to save data to MongoDB
    transformed_papers = [transform_paper_json(paper) for paper in responseData]
    state_relevant_array=[]
    for data in reversed(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"]}
        data["index"]=time.time()
        state_relevant_array.append({"paperId":data["paperId"],"index":data["index"]})

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
    found = await queries.find_one({"userId":userId,"query":query})
    if found:
       existing_papers = found["papers"]
       unique_entries = {paper['paperId']: paper for paper in existing_papers + state_relevant_array}
       merged_papers = list(unique_entries.values())
       queries.update_one({"userId":userId,"query":query},
                            {"$set":{"papers":merged_papers}})
       

async def get_queries_history(userId:str):
    all_queries = queries.find({"userId":userId},{"query":1,"_id":1}).sort({"index":-1})
    all_queries_result = [convert_to_serializable(queries) async for queries in all_queries]
    return all_queries_result
       

async def get_queries(userId,query=None):
    filterObj = {"userId":userId}

    if(query is not None):
        filterObj["query"]=query
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
            "query": { "$first": "$query" },
            "papers": { "$push": {"$mergeObjects":["$paperDetails","$papers"]}}
        }
        }
    ]    
    state_aggregated = queries.aggregate(query_paper_pipline)
    papers_results = [convert_to_serializable(papers) async for papers in state_aggregated]
    if(len(papers_results)>0):
        return papers_results[0]
    else: return papers_results