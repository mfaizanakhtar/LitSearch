'use client'
import React, { useEffect, useState } from 'react'
import Mock from '../components/mock'
// import ProjectListCard from './projectListCardOld'
import ProjectListCard from './projectListCard'
import InfoCardLarge from '../components/utility/InfoCardLarge'
import ButtonPrimary from '../components/utility/ButtonPrimary'
import { span } from 'vega'
import ProjectTeamCard from './projectTeamCard'
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Heading from '../components/utility/Heading'
import TextInput from '../components/utility/TextInput'
import CreateProject from './createProject'
import { useSession } from 'next-auth/react'
import projectState from '../states/projectsState'

// import { Fragment, useState, } from 'react'
// import { Dialog, Transition } from '@headlessui/react'
// import {
//   Bars3Icon,
//   CalendarIcon,
//   ChartPieIcon,
//   DocumentDuplicateIcon,
//   FolderIcon,
//   HomeIcon,
//   UsersIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline'

const Projects = () => {
    const { data: session, status }:any = useSession({
        required:true
      });
    const [userId,setUserId]=useState(null)
    const [showTeam,toggleShowTeam] = useState(false)
    const [dialogOpen,setDialogOpen]=useState(false)
    const {projects} = projectState()
    const {addNewProject} = projectState()
    const {getAllProjects} = projectState()

    useEffect(() => {
        const sessionUserId = session?.user?.id;
        if (sessionUserId) {
          setUserId(sessionUserId);
        }
      }, [session]);
    useEffect(()=>{
        if(userId){
            getAllProjects(userId)
        }
    },[userId])

    const createProject = (projectName:any,projectDescription:any,setDialogOpen:any)=>{
        addNewProject({name:projectName,desc:projectDescription},userId)
        console.log(projectName,projectDescription)
        setDialogOpen(false)
    }

    const getProjectDetails = (projectName:String)=>{
        console.log(projectName)
    }
  return (
    <>
    <CreateProject dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} createProject={createProject}/>
    <div className="flex flex-col h-screen overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
        {/* Creating and Viewing Projects (column 1) */}
        <div className="w-1/4 m-4 h-screen overflow-y-auto flex flex-col">
                <Heading HeadingText='Projects'/>
                <span className='flex w-full mt-2 p-1'><ButtonPrimary clickEvent={()=>{setDialogOpen(true)}} className='w-full' btnText={<>Create New Project</>}></ButtonPrimary></span>
            <div className='m-4'>
            <ul role="list" className="mt-3 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {projects.map((project)=>(
                <ProjectListCard clickEvent={getProjectDetails} projectName={project.name} projectDesc={project.desc}/>
            ))}
            </ul>
            </div>
            {/* <Mock /> */}
        </div>
        {/* Column 2 begin */}
        <div className="w-3/4 mt-4 h-screen overflow-y-auto flex flex-col">
            {/* Team Members */}
            <Heading
            customHtmlPrefix={
                <>
                    {showTeam ? <ChevronDownIcon onClick={()=>{toggleShowTeam(!showTeam)}} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" /> 
                    : <ChevronRightIcon onClick={()=>{toggleShowTeam(!showTeam)}} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                    }
                </>
            }
             HeadingText='Team Members'/>
             { showTeam ? 
             <>
                <div className='flex ml-4'>
                    <span className='w-3/6'><TextInput /></span>
                    <span className='w-2/6'><ButtonPrimary btnText={<>Invite new member</>} /></span>
                </div> 
                <div className='m-4'><ProjectTeamCard/></div>
            </>: <></> }
            {/* Research Papers Display */}
            <span className='ml-4'><Heading HeadingText='Research Papers'/></span>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>
            <div className='m-4'><InfoCardLarge/></div>

            {/* <Mock /> */}
        </div>
    </div>
    </div>
    </>
  )
}

export default Projects