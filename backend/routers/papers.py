import asyncio
import time
from backend.models import Event
from fastapi import APIRouter
from fastapi import BackgroundTasks
import time

from backend.db import engine
from backend.models import Event
from backend.services.api import  get_search_result
from backend.services.mongo import get_queries, get_queries_history, save_search_result


from backend.services.events import emit


router = APIRouter()
papers, eventlog, queries = engine["papers"], engine["events"], engine["queries"]
    

@router.get("/search", response_description="Search Papers")
async def add_user(background_tasks:BackgroundTasks,query:str,userId:str,isExistingQuery:bool=False):
    state_update_mongoQry=({"query":query,"userId":userId},{"$set":{"index":time.time()}})

    if(isExistingQuery): # to just update the timestamp to fetch latest search result
        background_tasks.add_task(queries.update_one,*state_update_mongoQry)
        return
    else:
        api_response , db_response = await asyncio.gather(get_search_result(query),get_queries(userId,query))
        # print(f'db response {db_response}')
        if not db_response : db_response = {"papers":[]}

        seen_ids = set()
        print(api_response.json().get("data"))
        merged_papers = [
            paper for paper in db_response.get("papers",[])
            + api_response.json().get("data",[]) if paper["paperId"] not in seen_ids and not seen_ids.add(paper["paperId"])
        ]

        if(len(merged_papers) != len(db_response.get("papers",[]))):
                background_tasks.add_task(save_search_result, query, userId, merged_papers)
                return {"query":query,"papers":merged_papers}
        else:
            queries.update_one(*state_update_mongoQry)
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
