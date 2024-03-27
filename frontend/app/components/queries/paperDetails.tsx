import React from 'react'
import InfoCardSmall from '../utility/InfoCardSmall'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import queriesState from '../../states/queriesState'


const PaperDetails = () => {
    const {isDetailView,detailPagePaper:paper} = queriesState()
    
    return <>
    <div className="bg-gray-50 p-5 w-full h-full border-gray-900 mt-4 mb-4 mr-4 rounded-lg fade-in">

        <span onClick={()=>(isDetailView(false))}
            className=' text-black bg-gray-50 hover:bg-gray-300 cursor-pointer hover:scale-105 transition-transform
            flex rounded-lg items-center pl-2 pr-2 mb-4 ring-4 ring-white h-6 w-16'
        >
            <ArrowUturnLeftIcon className="h-3 w-3" aria-hidden="true" />
            <p className='ml-2 text-xs'>Back</p>
        </span>
        
        <InfoCardSmall 
            paperId={paper.paperId}
            title={paper.title}
            breadCrumb={`${paper.publicationDate ? paper.publicationDate : ''} ${paper.publicationDate && paper.journalName ? ',' : ''} ${paper.journalName ? paper.journalName : ''}`}
            description={paper.abstract}
            footerLeft={`${paper.citationCount ? 'Citations: '+paper.citationCount :''} ${paper.referenceCount ? 'References: '+paper.referenceCount : ''}`}
            footerRight={paper.venue}
        />
    </div>
</>
}

export default PaperDetails