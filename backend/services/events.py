from asyncio import Future
import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from decimal import Decimal
import threading
import time

from backend.models import Event
from backend.services.api import fetch_references_citation
from backend.db import engine
from backend.services.mongo import save_ref_citation

handlers = defaultdict(lambda: [])

executor = ThreadPoolExecutor()

queries = engine["queries"]

def emit(event_type: str, event_data) -> Future:
    for fn in handlers[event_type]:
        if asyncio.iscoroutinefunction(fn):
            # If the handler is an async function, use asyncio to run it
            future = asyncio.create_task(fn(event_data))
        else:
            # If the handler is a regular function, use ThreadPoolExecutor
            future = executor.submit(fn, event_data)
        return future

def handle_downvote(event_data):
    request:Event = event_data['request']
    timestamp_ms = int(time.time() * 1000)
    updatedIndex=-999999999999+timestamp_ms
    searchTermMongoUpdate={"$set":{ "papers.$[elem].downvoted": request.data, 
                                    "papers.$[elem].upvoted": not request.data,
                                    "papers.$[elem].index":updatedIndex} }
    
    searchTermMongoQuery={"papers.paperId":request.paperId,"userId":request.userId}
    queries.update_one(searchTermMongoQuery,searchTermMongoUpdate,array_filters=[{ "elem.paperId": request.paperId }])


async def handle_upvote(event_data):
    request:Event = event_data['request']
    background_tasks = event_data['background_tasks']
    
    searchTermMongoQuery={"papers.paperId":request.paperId,"userId":request.userId}
    searchTermMongoUpdate={"$set":{ "papers.$[elem].upvoted": request.data, "papers.$[elem].downvoted": not request.data } }
    queries.update_one(searchTermMongoQuery,searchTermMongoUpdate,array_filters=[{ "elem.paperId": request.paperId }])
    relevantPapers = await fetch_references_citation(request.paperId)

    background_tasks.add_task(save_ref_citation,request.userId, request.query, relevantPapers)
    
    return relevantPapers

handlers['upvoted'].append(handle_upvote)
handlers['downvoted'].append(handle_downvote)