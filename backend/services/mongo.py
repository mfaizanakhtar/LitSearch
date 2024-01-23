import time
from backend.util import convert_to_serializable, transform_paper_json
from backend.db import engine

papers, eventlog, queries = engine["papers"], engine["events"], engine["queries"]

def save_search_result(query,userId,responseData):
    # Logic to save data to MongoDB
    transformed_papers = [transform_paper_json(paper) for paper in responseData]
    paperIds=[]
    for data in reversed(transformed_papers):
        paperMongoQuery = {"paperId": data["paperId"]}
        data["query"]=query

        paperMongoUpdate = {"$setOnInsert": data}
        papers.update_one(paperMongoQuery, paperMongoUpdate, upsert=True)
        paperIds.append({"paperId":data["paperId"],"index":time.time()})
    
    query_paperMongQuery = {"query":query,"userId":userId}
    query_paperMongoUpdate={"$setOnInsert":{"papers":paperIds,"index":time.time()}}
    queries.update_one(query_paperMongQuery,query_paperMongoUpdate,upsert=True)


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
    all_queries = queries.find({"userId":userId},{"query":1}).sort({"index":-1})
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