import asyncio
import time

from bson import ObjectId
from backend.models import Event
from fastapi import APIRouter
from fastapi import BackgroundTasks
import time

from backend.db import engine
from backend.models import Event
from backend.services.api import  get_search_result
from backend.services.mongo import get_queries, get_queries_history, save_search_result


from backend.services.events import emit
from backend.util import parse_mongo_dict


router = APIRouter()
papers, eventlog, queries = engine["papers"], engine["events"], engine["queries"]
    

@router.get("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,query:str,userId:str,isExistingQuery:bool=False):
    timestamp=time.time()
    state_update_mongoQry=({"query":query,"userId":userId},{"$set":{"index":timestamp}})

    if(isExistingQuery): # to just update the timestamp to fetch latest search result
        background_tasks.add_task(queries.update_one,*state_update_mongoQry)
        return
    else:
        db_response = await get_queries(userId,query)
        if db_response:
            queries.update_one(*state_update_mongoQry)
            return db_response
        else:
            api_response = await get_search_result(query)
            data = api_response.json().get("data",[])
            query_id = ObjectId()
            # project_id = ObjectId()
            background_tasks.add_task(save_search_result, query, userId, data,query_id)
            return {"_id":str(query_id),"query":query,"papers":data}
        
@router.get("/searchQueryById", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,queryId:str):
    db_response = await get_queries(queryId=queryId)
    return db_response


@router.get("/userQueryHistory",response_description="Get Previous Searched Papers")
async def get_user_papers(userId:str):
    all_queries_result = await get_queries_history(userId)
    if len(all_queries_result)>0:
            last_query = await get_queries(userId)
            all_queries_result[0]=last_query
    return all_queries_result

@router.post("/event",response_description="Record Paper Interaction")
async def record_event(request:Event,background_tasks:BackgroundTasks):
    future = emit(request.type, {"request": request, "background_tasks": background_tasks})

    if request.type == 'upvoted':
        result = await future
        return {"status": "updated", "relevantPapers": result}
    else:
        return {"status": "updated"}
