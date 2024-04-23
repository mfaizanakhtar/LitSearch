import React, { useState } from 'react'
import TextInput from '../utility/TextInput'
import Loader from '../utility/Loader'
import ButtonPrimary from '../utility/ButtonPrimary'
import projectState from '../../states/projectsState'
import genericState from '../../states/genericState'
import ProjectTeamCard from './projectTeamCard'
import Heading from '../utility/Heading'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid'

const TeamMembers = ({showTeam,toggleShowTeam}:{showTeam:boolean,toggleShowTeam:Function})=>{

    const [addingMemberLoader,setAddingMemeberLoader] = useState(false)
    const [addTeamErrorMsg,setAddTeamErrorMsg] = useState(null)
    const [txtTeamInvite,setTxtTeamInvite] = useState('')

    const {addMemberToProjTeam,selectedProject} = projectState()
    const {userId} = genericState()

    const addMemeberToTeam = async(invitedMember:string)=>{
        if(!invitedMember) return
        setAddingMemeberLoader(true)
        let isError = await addMemberToProjTeam(userId,invitedMember,selectedProject?.name)
        setAddingMemeberLoader(false)
        if(isError) setAddTeamErrorMsg(isError)
        else setAddTeamErrorMsg(null)
    }
    
  return (
    <>
        <Heading
        customHtmlPrefix={
            <>
                {showTeam ? <ChevronDownIcon onClick={()=>{toggleShowTeam(!showTeam)}} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" /> 
                : <ChevronRightIcon onClick={()=>{toggleShowTeam(!showTeam)}} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                }
            </>
        }
        HeadingText='Team Members'/>    <div className='fade-in'>
        {showTeam ? 
        <>
            <div className='flex ml-4'>
                <span className='w-3/6'><TextInput errorMsg={addTeamErrorMsg} onChange={setTxtTeamInvite} /></span>
                {addingMemberLoader ? 
                    <span className='ml-2 mr-2' ><Loader/></span> 
                    :
                    <span className='w-2/6'><ButtonPrimary clickEvent={()=>(addMemeberToTeam(txtTeamInvite))} >Invite new member</ButtonPrimary></span>
                }
            </div> 
            <div className='m-4'>
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {selectedProject?.team?.map((member)=>(
                    <ProjectTeamCard key={member.userId} name={member.name} role={member.role} image={member.image}/>
                    ))}
                    </ul>
            </div>
        </> 
        : 
        <></>}

    </div>
    </>
  )
}

export default TeamMembers

