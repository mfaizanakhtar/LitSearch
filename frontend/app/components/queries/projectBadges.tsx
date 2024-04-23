import { Project } from '@/app/interfaces'
import projectState from '@/app/states/projectsState'
import queriesState from '@/app/states/queriesState'
import React, { useEffect, useState } from 'react'
import Badge from '../utility/Badge'
import DropDown from '../utility/DropDown'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import genericState from '@/app/states/genericState'

const projectBadges = () => {

const {projects,AddRemoveQueryFromProject,getProjectDetails} = projectState()
const {queries,searchQuery} = queriesState()
const {userId,setDisplayMode,displayMode} = genericState()
const [queryProjects,setQueryProjects] = useState<Project[]>([])

useEffect(()=>{
    debugger
    let queryProjects = projects.filter((project)=>{
        return project.queries?.some((query)=>(query.queryId===queries[0]?._id))
    })
    setQueryProjects(queryProjects)
},[queries[0],JSON.stringify(projects),displayMode])

const handleQueryAddAndRemove = async(projectId:string)=>{
    if(userId){
        await AddRemoveQueryFromProject(userId,queries[0],projectId)
    }
}

const handleProjectBadgeClick = (projectId:string)=>{
    getProjectDetails(projectId,userId)
    setDisplayMode('project')
}

  return (
    <>
        {queryProjects.map((queryProject)=>(
            queryProject.name ? <span onClick={()=>{queryProject._id ? handleProjectBadgeClick(queryProject._id) : ''}} className='cursor-pointer'><Badge badgeText={queryProject.name} /></span> : ''
        ))}
        <DropDown 
            dropDownArray={projects.map((project)=>({name:project.name,
                ticked:project.queries?.some(projectQuery=>projectQuery.queryId==queries[0]?._id),
                clickEvent:()=>{project._id ? handleQueryAddAndRemove(project._id) : ''}}))}                            
            btnHtml={<PlusCircleIcon className='h-5 w-5 cursor-pointer' ></PlusCircleIcon>}
            heading='Add to project'
        />
    </>
  )
}

export default projectBadges