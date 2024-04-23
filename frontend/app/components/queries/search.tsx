'use client'
import React, { Fragment, useEffect, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { DocumentMagnifyingGlassIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import MagGlassIcon from '../utility/MagGlassIcon';

import DropDown from '../utility/DropDown';
import queriesState from '../../states/queriesState';
import projectState from '../../states/projectsState';
import genericState from '../../states/genericState';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ConfirmationDialog from '../utility/ConfirmationDialog';
import CreateProject from '../projects/createProject';
import Modal from '../utility/Modal';
import Badge from '../utility/Badge';
import { Project, Queries } from '@/app/interfaces';
import ProjectBadges from './projectBadges';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Search({setIsLoading}:any) {
    const {queries,searchQuery,setSortType} = queriesState()
    const {projects,selectedProject,getProjectDetails,deleteUserProject,addProjectAfterQuerySearch} = projectState()
    const {userId,displayMode,setDisplayMode,searchDisplay,setSearchDisplay} = genericState()

    const [currentQuery, setCurrentQuery] = useState('');
    const [open, setShowModal] = useState(false);
    const [sortByText,setSortByText]=useState('Sort By - Relevance')
    const [isConfirmationDialogOpen, setConfirmationDialogState] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState('')
    const [projectAddDialogOpen,setProjAddDialog]=useState(false)



    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    useEffect(()=>{
        let searchDisplay = (displayMode=='query' &&  queries.length>0) ? (queries[0].query) : 
            (displayMode=='project' ? selectedProject?.name :'')
        setSearchDisplay(searchDisplay || '')
    },[selectedProject,queries[0],displayMode])

    const handleKeyDown = async (event:any) => {
        if (event.key === 'Enter') {
            setCurrentQuery(event.target.value);
            console.log(currentQuery)
            closeModal();
            handleSearch()
        }
    }

    const handleChange = (event:any) => {
        setCurrentQuery(event.target.value)
    }

    const handleSearch = async (clickedItem?:any) => {
        setIsLoading(true)
        if(clickedItem?.type=='query' || clickedItem==undefined){
            let searchTerm = clickedItem && clickedItem.value ? clickedItem.value : currentQuery
            let searchResp:Queries = await searchQuery(searchTerm,userId,setIsLoading)
            setDisplayMode('query')
            debugger
            userId && searchResp?.createdProjectId ? 
            addProjectAfterQuerySearch(userId,
                searchResp?._id,
                searchResp?.createdProjectId,
                searchResp?.query
            ) : ''
        }
        else if(clickedItem?.type=='project'){
            await getProjectDetails(clickedItem.value,userId)
            setDisplayMode('project')
            setIsLoading(false)
        }
    };

    const openDeleteConfirmationPopup = (projectName:string,event:any) => {
        setConfirmationDialogState(true);
        setProjectToDelete(projectName)
        closeModal()
        event.stopPropagation()
    }
    
    const handleProjectDeleteConfirm = () => {
        deleteUserProject(userId,projectToDelete)
        setConfirmationDialogState(false); // Close the dialog
      };

    const filteredItems =
        currentQuery === ''
            ? queries
            : queries.filter((queriesItem) => {
                return queriesItem?.query?.toLowerCase().includes(currentQuery?.toLowerCase())
            })

    const filteredProjects = 
        currentQuery === ''
                ? projects
                : projects.filter((projectItem) => {
                    return projectItem?.name?.toLowerCase().includes(currentQuery?.toLowerCase())
                })

    const sortByYear = (sortType:'asc'|'desc'|'relevance',buttonText:string) =>{
        setSortByText(`Sort By - ${buttonText}`)
        setSortType("Year",sortType)
    } 
    
    const sortDropDownArray=[{name:"Relevance",clickEvent:()=>{sortByYear('relevance',"Relevance")}},
                    {name:"Year Ascending",clickEvent:()=>{sortByYear('asc',"Year Ascending")}},
                    {name:"Year Descending",clickEvent:()=>{sortByYear('desc',"Year Descending")}}
                ]

    return <>
        <CreateProject dialogOpen={projectAddDialogOpen} setDialogOpen={setProjAddDialog}/>
        <div className="relative mt-6 px-4 sm:px-6 lg:px-8 flex items-center" >
            <div className='flex-grow'>
                {displayMode=='query' ?<ProjectBadges/> : ''}

                <div className="relative mt-5 cursor-pointer" onClick={openModal}>
                    <input
                        style={{ pointerEvents: 'none' }}
                        name="search"
                        id="srch"
                        placeholder=""
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-10 pr-3"
                        type="text"
                        autoComplete='off'
                        value={searchDisplay}
                        readOnly={true}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        {displayMode=='query' ? <MagGlassIcon /> 
                        : 
                        <DocumentMagnifyingGlassIcon className={"h-5 w-5"}/>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-2 px-4 sm:px-6 lg:px-8 items-center cursor-pointer'>
            <div className='text-right static z-50'>
                <DropDown dropDownArray={sortDropDownArray} btnText={sortByText} />
            </div>
        </div>
        <Modal openState={open} closeFunction={closeModal} afterCloseFunc={() => setCurrentQuery('')}>
            <Combobox onChange={(item:any) => {handleSearch(item);closeModal()}}>
                <div className="relative">
                    <MagnifyingGlassIcon
                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    <Combobox.Input
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search..."
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                { (
                    <Combobox.Options static className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2">
                            <li>
                                <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">Queries</h2>
                                <ul className="mt-2 text-sm text-gray-800">
                                    {filteredItems.map((item:any) => (
                                        <Combobox.Option
                                            key={item.query}
                                            value={{'value':item.query,'type':'query'}}
                                            className={({ active }:any) =>
                                                classNames('cursor-pointer select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                                            }
                                        >
                                            {item.query}
                                        </Combobox.Option>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">Projects</h2>
                                <h2 onClick={()=>{setProjAddDialog(true);closeModal();}}
                                className="bg-gray-50 px-4 py-2.5 text-xs mt-1 mx-1 hover:bg-gray-100 text-center cursor-pointer border rounded font-bold text-gray-900">Create new project</h2>
                                <ul className="mt-2 text-sm text-gray-800 ">
                                    {filteredProjects.map((project:Project) => (
                                        <Combobox.Option
                                            key={project.name}
                                            value={{'value':project?._id,'type':'project'}}
                                            className={({ active }:any) =>
                                                classNames('cursor-pointer select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                                            }
                                        >
                                            <div className='flex justify-between items-center'>
                                            <div><span>{project.name}</span> - <span className='text-gray-400'>{project.desc}</span></div>
                                            <span onClick={(event)=>{project?._id ? openDeleteConfirmationPopup(project?._id,event) : ''}} className='hover:scale-125'><XMarkIcon className='h-4 w-4 transition-transform duration-150'/></span>
                                            </div>
                                        </Combobox.Option>
                                    ))}
                                </ul>
                            </li>
                    </Combobox.Options>
                )}

                {currentQuery !== '' && filteredItems.length === 0 && (
                    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                        {/* <FaceFrownIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" /> */}
                        <p className="mt-4 font-semibold text-gray-900">Press enter for a new search</p>
                        <p className="mt-2 text-gray-500">No Results Found in History!</p>
                    </div>
                )}
            </Combobox>
        </Modal>

        <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={setConfirmationDialogState}
                onConfirm={handleProjectDeleteConfirm}
            >
                <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
                <div className="mt-2">
                <p className="text-sm text-gray-500">Are you sure you want to delete this item? This action cannot be undone.</p>
                </div>
        </ConfirmationDialog>
    </>
}
