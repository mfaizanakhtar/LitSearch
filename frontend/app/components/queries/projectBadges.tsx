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
    <div className=''>
        {queryProjects?.length > 0 ? 
            <span className='-mt-1 mr-2'><Badge isColour={false} badgeText={'Associated Projects:'} /></span> 
        : '' }

        {queryProjects.map((queryProject)=>(
            queryProject.name ? <span key={queryProject._id} onClick={()=>{queryProject._id ? handleProjectBadgeClick(queryProject._id) : ''}} className='cursor-pointer'><Badge badgeText={queryProject.name} /></span> : ''
        ))}

        {queryProjects?.length > 0 ? 
            <DropDown
            dropDownArray={projects.map((project)=>({name:project.name,
                ticked:project.queries?.some(projectQuery=>projectQuery.queryId==queries[0]?._id),
                clickEvent:()=>{project._id ? handleQueryAddAndRemove(project._id) : ''}}))}                            
            btnHtml={<PlusCircleIcon className='h-4 w-4 cursor-pointer -mb-1 ml-2' ></PlusCircleIcon>}
            heading='Add to project'
            />
        : 
            <></>}

    </div>
    </>
  )
}

export default projectBadges