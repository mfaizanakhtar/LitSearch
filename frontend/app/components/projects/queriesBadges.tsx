import { Project } from '@/app/interfaces'
import projectState from '@/app/states/projectsState'
import queriesState from '@/app/states/queriesState'
import React, { useEffect, useState } from 'react'
import Badge from '../utility/Badge'
import DropDown from '../utility/DropDown'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import genericState from '@/app/states/genericState'

const QueriesBadges = () => {

const {selectedProject,AddRemoveQueryFromProject,getProjectDetails} = projectState()
const {searchQueryById} = queriesState()
const {userId,setDisplayMode,displayMode} = genericState()


const handleQueryBadgeClick = (queryId:string)=>{
    searchQueryById(queryId)
    setDisplayMode('query')
}

  return (
    <>
    <div className=''>
        
        <span className='-mt-1 mr-2'><Badge isColour={false} badgeText={'Associated Queries:'} /></span>
            

        {selectedProject?.queries ?
        selectedProject?.queries.map((query)=>(
            query.searchTerm ? <span key={query.queryId} onClick={()=>{query.queryId ? handleQueryBadgeClick(query.queryId) : ''}} className='cursor-pointer'><Badge badgeText={query.searchTerm+(query.papersCount ? `(${query.papersCount})` : '')} /></span> : ''
        ))
        : 
        ''
        }

    </div>
    </>
  )
}

export default QueriesBadges