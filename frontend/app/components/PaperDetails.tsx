import React from 'react'
import InfoCardSmall from './utility/InfoCardSmall'
import InfoCardLarge from './utility/InfoCardLarge'
import ButtonPrimary from './utility/ButtonPrimary'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import getState from '../state'


const PaperDetails = () => {
    const isDetailView = getState((state)=>state.isDetailView)
    const paper = getState((state)=>state.detailPagePaper)

    const detailViewHide = ()=>{
        isDetailView(false)
    }

    return <>
    <div className="bg-gray-50 p-5 w-full h-full border-gray-900 mt-4 mb-4 mr-4 rounded-lg fade-in">
        {/* <ButtonPrimary btnColourClass='border-gray-300' btnHoverColour='' 
        btnText={
        <>
            <span
                className=' text-black bg-gray-300 
                inline-flex rounded-lg ring-4 ring-white align-top h-5 w-5'
            >
                <ArrowUturnLeftIcon className="items-center h-3 w-3" aria-hidden="true" />
            </span>
            {/* <div>Hello</div> */}

        <span onClick={detailViewHide}
            className=' text-black bg-gray-50 hover:bg-gray-300 cursor-pointer hover:scale-105 transition-transform
            flex rounded-lg items-center pl-2 pr-2 mb-4 ring-4 ring-white h-6 w-16'
        >
            <ArrowUturnLeftIcon className="h-3 w-3" aria-hidden="true" />
            <p className='ml-2 text-xs'>Back</p>
        </span>
        
        <InfoCardSmall 
            key={paper.paperId}
            title={paper.title}
            breadCrumb={`${paper.publicationDate ? paper.publicationDate : ''} ${paper.publicationDate && paper.journalName ? ',' : ''} ${paper.journalName ? paper.journalName : ''}`}
            description={paper.abstract}
            footerLeft={`${paper.citationCount ? 'Citations: '+paper.citationCount :''} ${paper.referenceCount ? 'References: '+paper.referenceCount : ''}`}
            footerRight={paper.venue}
        />
        {/* <InfoCardLarge></InfoCardLarge> */}
    </div>
</>
}

export default PaperDetails