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
import Loader from '../components/utility/Loader'
import ConfirmationDialog from '../components/utility/ConfirmationDialog'
import Header from '../components/utility/Header'

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
    const [user,setUser]=useState({userId:null,userName:null,userImage:null})

    const [isConfirmationDialogOpen, setConfirmationDialogState] = useState(false);

    const [showTeam,toggleShowTeam] = useState(false)
    const [addTeamErrorMsg,setAddTeamErrorMsg] = useState(null)
    const [txtTeamInvite,setTxtTeamInvite] = useState('')
    const [addingMemberLoader,setAddingMemeberLoader] = useState(false)

    const [projectsLoading,setProjectsLoading]=useState(true)
    const [dialogOpen,setDialogOpen]=useState(false)
    const [selectedIndex,setSelectedIndex]=useState(-1)
    const [projectToDelete, setProjectToDelete] = useState('')
    const {projects,selectedProject,addNewProject,getAllProjects,getProjectDetails,addMemberToProjTeam,deleteUserProject,clearSelectedProject} = projectState()

    useEffect(() => {
        if(!user?.userId){
            const sessionUserId = session?.user?.id;
            const sessionUserImage = session?.user?.image
            const sessionUserName = session?.user?.name
            if (sessionUserId) {
                setUser({userId:sessionUserId,userName:sessionUserName,userImage:sessionUserImage})
              console.log(session?.user)
            }
            clearSelectedProject()
        }
      }, [session]);

    useEffect(() => {
    if (user?.userId) {
        setProjectsLoading(true)
        getAllProjects(user?.userId)
        setProjectsLoading(false)
    }
    }, [user]);

    const createProject = (projectName:any,projectDescription:any,setDialogOpen:any)=>{
        if(!projectName) return
        addNewProject({name:projectName,desc:projectDescription},user)
        if(selectedIndex!=null) setSelectedIndex(selectedIndex+1)
        console.log(projectName,projectDescription)
        setDialogOpen(false)
    }

    const getProjectDetail = (projectName:string,projectSelectedIndex:number)=>{
        console.log(projectName)
        setSelectedIndex(projectSelectedIndex)
        getProjectDetails(projectName,user?.userId)
    }
    const addMemeberToTeam = async(invitedMember:string)=>{
        if(!invitedMember) return
        setAddingMemeberLoader(true)
        let isError = await addMemberToProjTeam(user?.userId,invitedMember,selectedProject?.name)
        setAddingMemeberLoader(false)
        if(isError) setAddTeamErrorMsg(isError)
    }

    const openDeleteConfirmationPopup = (projectName:string) => {
        setConfirmationDialogState(true);
        setProjectToDelete(projectName)
    }

    const handleDeleteConfirm = () => {
        deleteUserProject(user?.userId,projectToDelete)
        setSelectedIndex(-1)
        setConfirmationDialogState(false); // Close the dialog
      };
  return (
    <>
    <CreateProject dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} createProject={createProject}/>
    <div className="flex flex-col h-screen overflow-hidden">
    <Header/>
    <div className="flex flex-1">
        {/* Creating and Viewing Projects (column 1) */}
        <div className="w-3/12 m-4 h-screen flex flex-col">
                {/* <Heading HeadingText='Projects'/> */}
                <span className='flex p-1 mx-4'><ButtonPrimary clickEvent={()=>{setDialogOpen(true)}} className='w-full' btnText={<>Create New Project</>}></ButtonPrimary></span>
            <div className='m-4 h-screen overflow-y-auto' style={{ height: 'calc(100vh - 11rem)' }}>
            {projectsLoading ? <Loader /> : <></>}
            <ul role="list" className="mt-3 mr-5 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {projects.map((project,index)=>(
                    <ProjectListCard key={index} 
                    openConfirmationPopup={openDeleteConfirmationPopup} 
                    clickEvent={getProjectDetail} 
                    projectName={project.name} 
                    projectDesc={project.desc} 
                    cardIndex={index} 
                    isSelected={index==selectedIndex}/>
                ))}
            </ul>
            </div>
            {/* <Mock /> */}
        </div>
            <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setConfirmationDialogState(false)}
                onConfirm={handleDeleteConfirm}
            >
                <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
                <div className="mt-2">
                <p className="text-sm text-gray-500">Are you sure you want to delete this item? This action cannot be undone.</p>
                </div>
            </ConfirmationDialog>
        {/* Column 2 begin */}
        { Object.keys(selectedProject).length > 0 ?
        <div className="w-3/4 mt-4 h-screen overflow-y-auto flex flex-col fade-in" style={{ height: 'calc(100vh - 7rem)' }}>
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
             <div className='fade-in'>
                <div className='flex ml-4'>
                    <span className='w-3/6'><TextInput errorMsg={addTeamErrorMsg} onChange={setTxtTeamInvite} /></span>
                    {addingMemberLoader ? 
                        <span className='ml-2 mr-2' ><Loader/></span> 
                        :
                        <span className='w-2/6'><ButtonPrimary clickEvent={()=>(addMemeberToTeam(txtTeamInvite))} btnText={<>Invite new member</>} /></span>
                    }
                </div> 
                    <div className='m-4'>
                        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8">
                        {selectedProject?.team?.map((member)=>(
                        <ProjectTeamCard key={member.userId} name={member.name} role={member.role} image={member.image}/>
                        ))}
                        </ul>
                    </div>
            </div>: <></> }
            {/* Research Papers Display */}
            <span className='ml-4'><Heading HeadingText='Research Papers'/></span>
                {selectedProject?.papers?.map((paper:any,index:number)=>(
                    <div key={index} className='m-4'>
                        <InfoCardLarge title={paper.title} details={paper.abstract} footerLeft={paper.journalName ? `Jounal Name: ${paper.journalName}` : ''} footerRight={`Citation count: ${paper.citationCount}`}/>
                    </div>
                ))}
            {/* <Mock /> */}
        </div>
        : <></>}
        {/* Column 2 ends */}
    </div>
    </div>
    </>
  )
}

export default Projects