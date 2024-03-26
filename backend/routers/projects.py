

from fastapi import APIRouter, HTTPException
from pymongo import ReturnDocument
from backend.db import engine
from backend.models import AddUserToProject, PaperProject, Project
from backend.util import convert_to_serializable, parse_mongo_dict



router = APIRouter()
projects , users = engine["projects"] , engine["users"]

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

@router.post("/addUserToProject",response_description='Adding User to a project')
async def addUserToProject(request:AddUserToProject):
    find_user = await users.find_one({"$or":[{"email":request.user},{"name":request.user}]})
    if find_user is not None:
        is_exists = await projects.find_one({"name":request.projectName,"team":{"$elemMatch":{"userId":find_user["userId"]}}})
        if is_exists is not None:
            raise HTTPException(status_code=500, detail="User already part of project")
        
        await projects.find_one_and_update({"name":request.projectName},{"$push":{"team":{"userId":find_user["userId"],"role":"collaborator"}}})
        return {"detail":{"addedUser":parse_mongo_dict(find_user)}}
    else:
        raise HTTPException(status_code=500, detail="User does not exists")
    
@router.delete("/deleteUserProject",response_description='Delete Project For User')
async def deleteUserProejct(projectName:str,userId:str):
    delete_result = await projects.find_one_and_delete({"name":projectName,"team":{"$elemMatch":{"userId":userId,"role":"owner"}}})
    if delete_result is None:
        delete_result = await projects.find_one_and_update({"name":projectName,"team":{"$elemMatch":{"userId":userId,"role":"collaborator"}}},
                                           {"$pull":{"team":{"userId":userId,"role":"collaborator"}}})
    if delete_result is None:
        raise HTTPException(status_code=500, detail="Unable to process delete request")
    return {"detail":"deleted successfully"}
    
@router.get("/getProjectDetails",response_description='Project papers and team members')
async def getProjectDetails(projectName:str,userId:str):
    # user_projects = projects.find({"team":{"$elemMatch":{"userId":userId}}},{"team":0}).sort({"_id":-1})

    user_project_details = projects.aggregate([
        {
            "$match": {"name": projectName, "team": {"$elemMatch": {"userId": userId}}}
        },
        {
            "$unwind": "$team"
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "team.userId",
                "foreignField": "userId",
                "as": "team.userDetails"
            }
        },
        {
            "$unwind": "$team.userDetails"
        },
        {
            "$group": {
                "_id": "$_id",
                "name": {"$first": "$name"},
                "desc": {"$first": "$desc"},
                "team": {"$push": {
                    "userId": "$team.userId",
                    "role": "$team.role",
                    # "userDetails": "$team.userDetails"
                    "email": "$team.userDetails.email",
                    "image": "$team.userDetails.image",
                    "name": "$team.userDetails.name",
                    "provider": "$team.userDetails.provider"
                }},
                "papers": {"$first": "$papers"}  # Preserves the papers array to be processed later
            }
        },
        {
            "$unwind": {
                "path": "$papers", 
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$lookup": {
                "from": "papers",
                "localField": "papers.paperId",
                "foreignField": "paperId",
                "as": "paperDetails"
            }
        },
        {
            "$unwind": {
                "path": "$paperDetails", 
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "name": {"$first": "$name"},
                "desc": {"$first": "$desc"},
                "team": {"$first": "$team"},  # Assumes team details have already been properly aggregated
                "papers": {
                    "$push": {
                        "$cond": [
                            {"$not": ["$papers.paperId"]},
                            "$$REMOVE",
                            {
                                "paperId": "$papers.paperId",
                                # "paperDetails": "$paperDetails"
                                "abstract": "$paperDetails.abstract",
                                "citationCount": "$paperDetails.citationCount",
                                "journalName": "$paperDetails.journalName",
                                "title": "$paperDetails.title",
                                "publicationDate":"$paperDetails.publicationDate"
                            }
                        ]
                    }
                }
            }
        }
    ])

    parsed_project_details = [convert_to_serializable(project_detail) async for project_detail in user_project_details]
    if len(parsed_project_details) > 0: 
        return parsed_project_details[0] 
    else: raise HTTPException(status_code=500, detail="Project For the user do not exists")
