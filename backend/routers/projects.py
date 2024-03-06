

from fastapi import APIRouter, HTTPException
from backend.db import engine
from backend.models import PaperProject, Project
from backend.util import convert_to_serializable, parse_mongo_dict



router = APIRouter()
projects = engine["projects"]

@router.post("/addProject",response_description='Add New Projects')
async def addProject(request:Project):
    is_exists = await projects.find_one({"name":request.name})
    if(is_exists is None):
        await projects.insert_one({
            "name":request.name,
            "desc":request.desc,
            "team":[{"userId":request.userId,"role":"owner"}],
            "papers":[]})
        
        return {"detail":"Created successfully"}
    
    raise HTTPException(status_code=500, detail="Project name not available")

@router.get("/getUserProjects",response_description='Get projects for a user')
async def getUserProjects(userId:str):
    user_projects = projects.find({"team":{"$elemMatch":{"userId":userId}}},{"team":0}).sort({"_id":-1})
    parsed_user_projects = [convert_to_serializable(projects) async for projects in user_projects]
    return parsed_user_projects

@router.post("/addPaperToProject",response_description='Paper id added to project')
async def addPaperToProject(request:PaperProject):
    is_exists = await projects.find_one({"name":request.projectName,"papers":{"$elemMatch":{"paperId":request.paperId}}})
    print(is_exists)
    updateResult = None
    if(is_exists is None):
        mongo_update_query = {"$push":{"papers":{"paperId":request.paperId,"addedBy":request.userId}}} #if not exists, add
    else:
        mongo_update_query = {"$pull":{"papers":{"paperId":request.paperId}}} # if exists, pull that record
    updateResult = await projects.find_one_and_update({"name":request.projectName},
                            mongo_update_query)

    # print(updateResult)
    return {"detail":parse_mongo_dict(updateResult)}

@router.get("/getProjectDetails",response_description='Project papers and team members')
async def getProjectDetails(projectName:str,userId:str):
    # user_projects = projects.find({"team":{"$elemMatch":{"userId":userId}}},{"team":0}).sort({"_id":-1})

    user_project_details = projects.aggregate([
        {
            "$match": {"name":projectName,"team":{"$elemMatch":{"userId":userId}}}
        },
        {
            "$unwind": "$papers" #// Deconstructs the `papers` array
        },
        {
            "$lookup": {
                "from": "papers", #// The name of the collection to join with
                "localField": "papers.paperId", #// Field from the input documents
                "foreignField": "paperId", #// Field from the documents of the "from" collection
                "as": "paperDetails" #// Output array field with the joined documents
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "name": { "$first": "$name" },
                "desc": { "$first": "$desc" },
                "team": { "$first": "$team" },
                "papers": { "$push": { "paperId": "$papers.paperId", "paperDetails": "$paperDetails" } }
            }
        }
    ])
    
    parsed_project_details = [convert_to_serializable(project_detail) async for project_detail in user_project_details]
    if len(parsed_project_details) > 0: 
        return parsed_project_details[0] 
    else: raise HTTPException(status_code=500, detail="Project For the user do not exists")
