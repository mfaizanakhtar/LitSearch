import { create } from "zustand";
import { Project } from "../interfaces";
import axios from "axios";

interface ProjectState{
    projects:Array<Project>
    addNewProject:(project:Project,userId:any)=>void
    getAllProjects:(userId:String|any)=>void
    addPaperToProject:(userId:String,paperId:any,projectName:String)=>void
}

const projectState = create<ProjectState>()((set) => ({
    projects:[],
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
       let {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/projects/addPaperToProject`,
            {paperId:paperId,projectName:projectName,userId:userId}
       )
       console.log(data)
    },
    
}))

export default projectState