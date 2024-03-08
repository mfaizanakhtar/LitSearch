import { create } from "zustand";
import { Project } from "../interfaces";
import axios from "axios";

interface ProjectState{
    projects:Array<Project>
    selectedProject:Project|any
    addNewProject:(project:Project,userId:any)=>void
    getAllProjects:(userId:String|any)=>void
    addPaperToProject:(userId:String,paperId:any,projectName:String)=>void
    getProjectDetails:(projectName:String,userId:String|any)=>void
}

const projectState = create<ProjectState>()((set) => ({
    projects:[],
    selectedProject:{},
    addNewProject:async(project:Project,userId:any)=>{
        let {data}:any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addProject`,{...project,userId})
        if(data){
            set((state)=>{
                let updatedProjects:Array<Project> = [...state.projects]
                updatedProjects.unshift(project)
                return {projects:updatedProjects}
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
        let {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/projects/getProjectDetails?projectName=${projectName}&userId=${userId}`)
        console.log(data)
        set((state)=>{
            let updatedProjects = state.projects
            updatedProjects.forEach((project)=>{
                if(project.name==projectName){
                    project={...data,detailsFetched:true}
                }
            })
            return {projects:updatedProjects}
        })
    },
    
}))

export default projectState