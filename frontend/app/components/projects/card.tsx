import {Paper,Events} from '../../interfaces';
import ThumbUpIcon from '../utility/ThumbUpIcon';
import ThumbDownIcon from '../utility/ThumbDownIcon';
import { PlusCircleIcon,MinusCircleIcon } from '@heroicons/react/24/outline'
import LabelText from '../utility/LabelText';
import Loader from '../utility/Loader';
import { useState } from 'react';
import DropDown from '../utility/DropDown';
import queriesState from '@/app/states/queriesState';
import projectState from '@/app/states/projectsState';
import genericState from '@/app/states/genericState';
import ConfirmationDialog from '../utility/ConfirmationDialog';
import Badge from '../utility/Badge';
import Tooltip from '../utility/Tooltip';
import CreateProject from './createProject';

export default function Card(paper: Paper) {

    const {setEvent,isDetailView,setDetailPagePaper,queries} = queriesState()
    const {projects,AddRemovePaperFromProject,selectedProject,updatedQueriesCountInAssociatedProjects} = projectState()
    const {displayMode,userId,showAlert} = genericState()

    const [isLoadingRelevant,setIsLoadingRelevant]=useState(false)
    const [relevantLoadedSize,setRelevantLoadedSize]=useState(0)
    const [isRemoved,setIsRemoved]=useState(false)
    const [isConfirmationDialogOpen, setConfirmationDialogState] = useState(false);
    const [projectAddDialogOpen,setProjAddDialog]=useState(false)
    
    const detailViewclick = () => {
        isDetailView(true)
        setDetailPagePaper(paper)
    }

    const handleThumbUpClick = async () => {
        setIsLoadingRelevant(true)
        if(userId){
            let event:Events={type:'upvoted',userId:userId}
            await setEvent(paper?.arrayIndex ? paper.arrayIndex : 0,event,setRelevantLoadedSize)
            let queriesUpdatedLength = queries[0]?.papers.length
            updatedQueriesCountInAssociatedProjects(queries[0]._id,queriesUpdatedLength)
        }
        setIsLoadingRelevant(false)

    };

    const handleThumbDownClick = async () => {
        setIsRemoved(true)
        setTimeout(async () => {
            let event:Events={type:'downvoted',userId:userId || undefined}
            await setEvent(paper.arrayIndex ? paper.arrayIndex : 0,event)
            setIsRemoved(false)
        }, 500);
    };

    const handlePaperFromProjDelete = ()=>{
        setIsRemoved(true)
        setTimeout(async () => {
            userId && selectedProject?._id ? await AddRemovePaperFromProject(userId,paper,selectedProject._id) : ''
            setIsRemoved(false)
        }, 500);
        setConfirmationDialogState(false)
        showAlert(`'${paper.title}' Paper removed from this project`)
    }

    const handlePaperAddToProject = async(projectId:string,projectName:string) => {
        if(userId){
            let isAdded = await AddRemovePaperFromProject(userId,paper,projectId)
            isAdded ? showAlert(`Paper added to project '${projectName}'`) : showAlert(`Paper removed from the project '${projectName}'`)
        }
    }
    return <>
        <li id={paper.paperId} className={`z-10 rounded-md shadow mb-3 relative flex justify-between gap-y-6 ${isRemoved ? 'fade-out' : 'fade-in'} transform ${paper.isHovered ? 'scale-105 transition-transform border-2 border-primary' : 'scale-100 transition-transform'} hover:scale-105 transition-transform`}>
        <div className="flex min-w-0 gap-x-4 p-4">
            {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
            <div className="min-w-0 flex-auto">
            <p onClick={detailViewclick} className="text-sm font-semibold leading-6 text-gray-900 hover:underline hover:cursor-pointer">
                {paper.title}
            </p>
                {paper.publicationDate || paper.journalName ?
                    <div className='flex'>
                        <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                        <p className="mt-1 ml-2 text-xs leading-5 text-gray-500">{`${paper.publicationDate ? paper.publicationDate : ""} ${paper.publicationDate && paper.journalName ? "," : ""} ${paper.journalName ? paper.journalName : ""}`}</p>
                    </div> 
                : <></>}
                    {displayMode=='query' ?
                        <>
                        <div className='mt-5 flex'>
                            <ThumbUpIcon clickEvent={handleThumbUpClick} iconStatus={paper.upvoted ? paper.upvoted : false} />
                            <ThumbDownIcon clickEvent={handleThumbDownClick} iconStatus={paper.downvoted ? paper.downvoted : false} />
                            <div className='absolute right-4 bg-opacity-100'><DropDown 
                                dropDownArray={[{name:"CREATE NEW PROJECT",clickEvent:()=>{setProjAddDialog(true)},strong:true},...projects.map((project)=>({name:project.name,
                                    ticked:project.papers?.some(projectPaper=>projectPaper.paperId==paper.paperId),
                                    clickEvent:()=>( (project?._id && project?.name) && handlePaperAddToProject(project._id,project.name) )}))]}                            
                                btnHtml={<Tooltip text='Save this paper to project'><PlusCircleIcon className='h-5 w-5 cursor-pointer' /></Tooltip>}
                                heading='Add to project'
                            /></div>
                        </div>  
                        <CreateProject dialogOpen={projectAddDialogOpen} setDialogOpen={setProjAddDialog}/>
                        </>
                    : 
                        <div className='mt-5 flex'>
                            <div className='absolute right-4 bg-opacity-100'>
                                <Tooltip text='Remove this paper from project'><MinusCircleIcon onClick={()=>(setConfirmationDialogState(true))} className='h-5 w-5 cursor-pointer' ></MinusCircleIcon></Tooltip>
                            </div>
                        </div>
                    }
                    {(paper.query || (displayMode=='query' && queries[0].query)) ? 
                    <div className='mt-4 -mb-3'>
                        <span className='-mt-1 mr-2'><Badge isColour={false} badgeText={'Search Term:'} /></span> 
                        <Badge badgeText={paper.query || queries[0].query} />
                    </div>
                    : 
                    ''}
                    
                    <div className='mt-5 flex'>
                        {isLoadingRelevant ? <>
                        <span className='ml-3 h-4 w-2 mr-4'><Loader /></span>
                        <LabelText text={`Looking for more relevant papers...`}></LabelText>
                        </>: <></>}
                        {relevantLoadedSize>0 ? <LabelText text={`New ${relevantLoadedSize} Papers Added`}></LabelText>: <></>}
                    </div>
            </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-4">
        </div>
        </li>
        <div className='z-50'>
        <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setConfirmationDialogState(false)}
                onConfirm={handlePaperFromProjDelete}
            >
                <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
                <div className="mt-2">
                <p className="text-sm text-gray-500">Are you sure you want to delete this item? This action cannot be undone.</p>
                </div>
        </ConfirmationDialog>
        </div>
    </>
}