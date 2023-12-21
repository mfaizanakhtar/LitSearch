import { useSession } from 'next-auth/react';
import {Paper,PaperEvents} from '../../interfaces';
// import { HandThumbUpIcon as HandThumbUpIconSolid,HandThumbDownIcon as HandThumbDownIconSolid} from '@heroicons/react/20/solid'
// import { HandThumbUpIcon as HandThumbUpIconOutline,HandThumbDownIcon as HandThumbDownIconOutline} from '@heroicons/react/24/outline'
import ThumbUpIcon from './ThumbUpIcon';
import ThumbDownIcon from './ThumbDownIcon';
import getState from '@/app/state';
import axios from 'axios';

export default function Card(paper: Paper) {

    const updatePaper = getState((state) => state.updatePaper);

    const {data : session}:any = useSession({
        required:true
      })

    const handleThumbUpClick = async () => {
        let eventObj:PaperEvents
        if(paper.paperEvents){
            eventObj= {positive:!paper.paperEvents.positive,negative:false}
        }else{
            eventObj= {positive:true,negative:false}
        }
        eventObj.paperId=paper.pid
        eventObj.userId=session.user.id
        updatePaper(paper?.index,{
            paperEvents:eventObj
        })

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/event`,eventObj)
        console.log(response)

    };

    const handleThumbDownClick = async () => {
        let eventObj:PaperEvents
        if(paper.paperEvents){
            eventObj= {positive:false,negative:!paper.paperEvents.negative}
        }else{
            eventObj= {positive:false,negative:true}
        }
        eventObj.paperId=paper.pid
        eventObj.userId=session.user.id
        updatePaper(paper?.index,{
            paperEvents:eventObj
        })
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/event`,eventObj)
        console.log(response)
    };
    return <>
        <li className={`overflow-hidden rounded-md shadow mb-3 relative flex justify-between gap-y-6`}>
        <div className="flex min-w-0 gap-x-4 p-4">
            {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
            <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">
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
                    <div className='mt-5 flex'>
                        <ThumbUpIcon clickEvent={handleThumbUpClick} iconStatus={paper.paperEvents?.positive ? paper.paperEvents.positive : false} />
                        <ThumbDownIcon clickEvent={handleThumbDownClick} iconStatus={paper.paperEvents?.negative ? paper.paperEvents.negative : false} />
                    </div>
                {/* <p className="text-xs leading-5 text-gray-500">{descKey ? result[descKey] : null}</p> */}
                {/* </div> */}
            </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-4">
            {/* <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">Role space</p>
            {
            //   person.lastSeen ? (
            //     <p className="mt-1 text-xs leading-5 text-gray-500">
            //       Last seen 
            //       <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
            //     </p>
            //   ) 
            //   : 
            (
                <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
            )}
            </div> */}
            {/* <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" /> */}
        </div>
        </li>
    </>
}