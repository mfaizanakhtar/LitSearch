import { create } from "zustand";
import { Project } from "../interfaces";
import axios from "axios";

interface ProjectState{
    projects:Array<Project>
    selectedProject:Project
    clearSelectedProject:()=>void
    addNewProject:(project:Project,user:any)=>any
    deleteUserProject:(userId:string|any,projectName:string)=>void
    getAllProjects:(userId:string|any)=>void
    addPaperToProject:(userId:string,paperId:any,projectName:string)=>void
    addMemberToProjTeam:(invitedByMember:string|any,invitedMember:string,projectName:string|any)=>any
    getProjectDetails:(projectName:string,userId:string|any)=>void
}

const projectState = create<ProjectState>()((set) => ({
    projects:[],
    selectedProject:{},
    clearSelectedProject:()=>set(()=>({selectedProject:{}})),
    deleteUserProject:async(userId:string,projectName:string)=>{
        let{data}:any = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}api/projects/deleteUserProject?projectName=${projectName}&userId=${userId}`)
        console.log(data)
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects = updatedProjects.filter((project)=>(project.name!=projectName))
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
        if(responseData?.data){
            set((state)=>{
                let updatedProjects:Array<Project> = [...state.projects]
                let updatedSelectedProject = state.selectedProject
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
    addPaperToProject:async(userId:String,paperId:any,projectName:String)=>{
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project)=>{
                if(project.name==projectName){
                    debugger
                    let isExistsIndex = project.papers?.findIndex(paper=>paper.paperId=paperId)
                    if(isExistsIndex!=undefined && isExistsIndex>-1) project.papers?.splice(isExistsIndex,1)
                    else project.papers?.push({paperId:paperId})
                }
            })
            return {projects:updatedProjects}
       })
       let {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addPaperToProject`,
            {paperId:paperId,projectName:projectName,userId:userId}
       )
       console.log(data)

    },
    getProjectDetails:async(projectName, userId)=> {
        let updatedSelectedProject:any = null
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project)=>{
                if(project.name==projectName){
                    if(project.detailsFetched){
                        updatedSelectedProject = project
                    }
                }
            })
            if(updatedSelectedProject) return {selectedProject:updatedSelectedProject} 
            else return{}

        })
        if(updatedSelectedProject) return
        let {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/projects/getProjectDetails?projectName=${projectName}&userId=${userId}`)
        console.log(data)
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project,index)=>{
                if(project.name==projectName){
                    project={...data,detailsFetched:true}
                    updatedSelectedProject=project
                    updatedProjects[index]=project
                }
            })
            return {projects:updatedProjects,selectedProject:updatedSelectedProject}
        })
    },
    
}))

export default projectState