import { useSession } from 'next-auth/react';
import {Paper,Events} from '../../interfaces';
// import { HandThumbUpIcon as HandThumbUpIconSolid,HandThumbDownIcon as HandThumbDownIconSolid} from '@heroicons/react/20/solid'
// import { HandThumbUpIcon as HandThumbUpIconOutline,HandThumbDownIcon as HandThumbDownIconOutline} from '@heroicons/react/24/outline'
import ThumbUpIcon from './ThumbUpIcon';
import ThumbDownIcon from './ThumbDownIcon';
import getState from '@/app/state';
import axios from 'axios';
import LabelText from './LabelText';
import Loader from './Loader';
import { useState } from 'react';

export default function Card(paper: Paper) {

    const setEvent = getState((state)=>state.setEvent)
    const isDetailView = getState((state)=>state.isDetailView)
    const setDetailPagePaper = getState((state)=>state.setDetailPagePaper)
    const [isLoadingRelevant,setIsLoadingRelevant]=useState(false)
    const [relevantLoadedSize,setRelevantLoadedSize]=useState(0)
    const [isRemoved,setIsRemoved]=useState(false)

    const {data : session}:any = useSession({
        required:true
      })
    
    const detailViewclick = () => {
        isDetailView(true)
        setDetailPagePaper(paper)
    }

    const handleThumbUpClick = async () => {
        setIsLoadingRelevant(true)
        let event:Events={type:'upvoted',userId:session?.user.id}
        await setEvent(paper?.arrayIndex ? paper.arrayIndex : 0,event,setRelevantLoadedSize)
        setIsLoadingRelevant(false)

    };

    const handleThumbDownClick = async () => {
        setIsRemoved(true)
        setTimeout(async () => {
            let event:Events={type:'downvoted',userId:session?.user.id}
            await setEvent(paper.arrayIndex ? paper.arrayIndex : 0,event)
            setIsRemoved(false)
        }, 500);
    };
    return <>
        <li className={`overflow-hidden rounded-md shadow mb-3 relative flex justify-between gap-y-6 ${isRemoved ? 'fade-out' : 'fade-in'} transform hover:scale-105 transition-transform`}>
        <div className="flex min-w-0 gap-x-4 p-4">
            {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
            <div className="min-w-0 flex-auto">
            <p onClick={detailViewclick} className="text-sm font-semibold leading-6 text-gray-900 hover:underline hover:cursor-pointer">
                {paper.title}
            </p>
            {/* <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a href="#" className="relative truncate hover:underline">
                {result.publicationDate?.substr(0,4)} - {result.journal.name}
                </a>
            </p> */}
                {/* <div className="mt-1 flex items-center gap-x-1.5"> */}
                {/* <div className="flex-none rounded-full bg-gray-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div> */}
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
                    <div className='mt-5 flex'>
                        <ThumbUpIcon clickEvent={handleThumbUpClick} iconStatus={paper.upvoted ? paper.upvoted : false} />
                        <ThumbDownIcon clickEvent={handleThumbDownClick} iconStatus={paper.downvoted ? paper.downvoted : false} />
                    </div>
                    <div className='mt-5 flex'>
                        {isLoadingRelevant ? <>
                        <span className='ml-3 h-4 w-2 mr-4'><Loader /></span>
                        <LabelText text={`Looking for more relevant papers...`}></LabelText>
                        </>: <></>}
                        {relevantLoadedSize>0 ? <LabelText text={`New ${relevantLoadedSize} Papers Added`}></LabelText>: <></>}
                    </div>

                {/* <p className="text-xs leading-5 text-gray-500">{descKey ? result[descKey] : null}</p> */}
                {/* </div> */}
            </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-4">
            {/* <div className="hidden sm:flex sm:flex-col">
            <p className="text-sm leading-6 text-gray-900">Role space</p>
              (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen 
                </p>
              ) 
            (
                <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
            )
            </div> */}
            {/* <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" /> */}
        </div>
        </li>
        {/* {paper.paperReferenceCitations && paper.paperReferenceCitations.map((childPaper,index) => (
            <div className='ml-4'><Card key={childPaper.paperId} index={index} parentIndex={paper.index} {... childPaper} isChild={true}/></div>
        ))} */}
        {/* <LabelText text='Hello'></LabelText> */}
    </>
}