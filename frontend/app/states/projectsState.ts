import { create } from "zustand";
import { Project, Queries } from "../interfaces";
import axios from "axios";

interface ProjectState{
    projects:Array<Project>
    selectedProject:Project
    addNewProject:(project:Project,user:any)=>any
    deleteUserProject:(userId:string|any,projectId:string)=>void
    getAllProjects:(userId:string|any)=>void
    addProjectAfterQuerySearch:(userId:string,queryId:string,projectId:string,querySearchTerm:string)=>void
    AddRemovePaperFromProject:(userId:string,paperId:any,projectId:string)=>Promise<boolean>
    AddRemoveQueryFromProject:(userId:string,query:Queries,projectId:string)=>Promise<boolean>
    addMemberToProjTeam:(invitedByMember:string|any,invitedMember:string,projectName:string|any)=>any
    getProjectDetails:(projectId:string,userId:string|any)=>void
    updatedQueriesCountInAssociatedProjects:(queryId:string,paperCount:number)=>void
}

const projectState = create<ProjectState>()((set) => ({
    projects:[],
    selectedProject:{},
    deleteUserProject:async(userId:string,projectId:string)=>{
        let{data}:any = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}api/projects/deleteUserProject?projectId=${projectId}&userId=${userId}`)
        console.log(data)
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects = updatedProjects.filter((project)=>(project._id!=projectId))
            return {projects:updatedProjects,selectedProject:{}}
        })
    },
    addNewProject:async(project:Project,user:any)=>{
        let userId = user?.userId
        let responseData:any=null
        try {
            responseData= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addProject`,{...project,userId})
        } catch (error:any) {
            return error?.response?.data?.detail
        }
        if(responseData?.data && responseData?.data?.projectId){
            set((state)=>{
                let updatedProjects:Array<Project> = [...state.projects]
                let updatedSelectedProject = state.selectedProject
                project._id = responseData.data.projectId
                project.queries=[]
                project.papers=[]
                project.team=[{"name":user?.userName,"userId":userId,"role":"owner","image":user?.userImage}]
                updatedProjects.unshift(project)
                updatedSelectedProject = project
                return {projects:updatedProjects,selectedProject:project}
            })
        }
    },
    getAllProjects:async(userId:String)=>{
        let {data}:any = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/projects/getUserProjects?userId=${userId}`)
        set(()=>{
            let updatedProjects:Array<Project> = data
            return {projects:updatedProjects}
        })
    },
    addProjectAfterQuerySearch:async(userId:string,queryId:string,projectId:string,querySearchTerm:string)=>{
        set((state)=>{
            let updatedProjects:Array<Project> = state.projects
            let newProject:Project = {
                _id: projectId,
                name: querySearchTerm,
                papers: [],
                queries: [
                    {
                        queryId: queryId,
                        searchTerm: querySearchTerm,
                        addedBy: userId
                    }
                ]
            }
            updatedProjects.unshift(newProject)
            return {projects:updatedProjects}
        })
    },
    addMemberToProjTeam:async(invitedByMember:String,invitedMember:String,projectName:String)=>{
        try{
            debugger
            let {data}:any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addUserToProject`,
            {"projectName":projectName,"user":invitedMember})
            set((state)=>{
                let updatedProjects = state.projects
                let selectedProject = state.selectedProject
                updatedProjects.forEach((project)=>{
                    if(project?.name==selectedProject?.name && data?.detail?.addedUser){
                        project.team?.push({...data.detail.addedUser,role:"collaborator"})
                        // selectedProject.team?.unshift(data.detail.addedUser)
                    }
                })
                return {projects:updatedProjects}
            })
        }catch(ex:any){
            return ex?.response?.data?.detail
        }
        
    },
    AddRemovePaperFromProject:async(userId:String,paper:any,projectId:String)=>{
        let isAdded:boolean = false
        set((state)=>{
            let updatedProjects = state.projects
            let selectedProject = state.selectedProject
            updatedProjects.forEach((project)=>{
                if(project._id==projectId){
                    debugger
                    let isExistsIndex = project.papers?.findIndex(p=>p.paperId==paper?.paperId)
                    if(isExistsIndex!=undefined && isExistsIndex>-1) {project.papers?.splice(isExistsIndex,1);isAdded=false}
                    else {project.papers?.push(paper); isAdded=true}
                    selectedProject = project
                }
            })
            return {projects:updatedProjects,selectedProject:selectedProject}
       })
       let {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addPaperToProject`,
            {paperId:paper?.paperId,projectId:projectId,userId:userId}
       )
       return isAdded
    },
    AddRemoveQueryFromProject:async(userId:String,query:Queries,projectId:String)=>{
        let isAdded:boolean = false
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project)=>{
                if(project._id==projectId){
                    let isExistsIndex = project.queries?.findIndex(q=>q.queryId==query._id)
                    if(isExistsIndex!=undefined && isExistsIndex>-1) {project.queries?.splice(isExistsIndex,1);isAdded=false}
                    else {project.queries?.push({queryId:query._id,searchTerm:query.query});isAdded=true}
                }
            })
            return {projects:updatedProjects}
       })
       let {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addQueryToProject`,
            {queryId:query?._id,searchTerm:query.query,projectId:projectId,userId:userId}
       )
       return isAdded
    },
    getProjectDetails:async(projectId, userId)=> {
        debugger
        let updatedSelectedProject:any = null
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project)=>{
                if(project._id==projectId){
                    if(project.detailsFetched){
                        updatedSelectedProject = project
                    }
                }
            })
            if(updatedSelectedProject) return {selectedProject:updatedSelectedProject} 
            else return{}

        })
        if(updatedSelectedProject) return
        let {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/projects/getProjectDetails?projectId=${projectId}&userId=${userId}`)
        console.log(data)
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project,index)=>{
                if(project._id==projectId){
                    project={...data,detailsFetched:true}
                    updatedSelectedProject=project
                    updatedProjects[index]=project
                }
            })
            return {projects:updatedProjects,selectedProject:updatedSelectedProject}
        })
    },
    updatedQueriesCountInAssociatedProjects:(queryId:string,paperCount:number)=>{
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach(project => {
                project.queries?.forEach((query)=>{
                    if(query.queryId==queryId) query.papersCount=paperCount
                })
            });
            return {projects:updatedProjects}
        })
    }
    
}))

export default projectState