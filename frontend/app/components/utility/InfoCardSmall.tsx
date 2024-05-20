import { InformationCircleIcon,BookOpenIcon,ClipboardIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import ButtonPrimary from './ButtonPrimary'
import Tooltip from './Tooltip'

interface InfoCard{
    paperId:string,
    title:string,
    breadCrumb:string,
    description:string,
    footerLeft:string,
    footerLink?:string,
    footerRight:string
}

const InfoCardSmall = ({paperId,title,breadCrumb,description,footerLeft,footerLink,footerRight}:InfoCard) => {

  const [clipBoardTxt,setClipBoardTxt] = useState('Copy to clipboard')

  useEffect(()=>{
    setClipBoardTxt('Copy to clipboard')
  },[title])

  const copyClickBoardEvent=()=>{
    setClipBoardTxt('Copied to clipboard')
    navigator.clipboard.writeText(title)
  }


  return <>
    <div key={paperId} className="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <div 
        //   key={person.email}
          className="fade-in relative flex space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
        <span
            className='text-primary bg-primaryLight 
            inline-flex rounded-lg p-3 ring-4 ring-white align-top h-12 w-12'
        >
            <BookOpenIcon className=" items-start h-6 w-6" aria-hidden="true" />
        </span>
          {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={person.imageUrl} alt="" />
          </div> */}
          <div className="min-w-0 flex-1">
            <a className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />

              <span className="text-xm font-medium text-gray-900">
                {title ? title : ''}
                <Tooltip text={clipBoardTxt}>
                  <ClipboardIcon onClick={copyClickBoardEvent} className='text-gray-500 h-5 w-5 inline ml-1 align-text-bottom cursor-pointer z-20'/>
                </Tooltip>
              </span>      
              <p className="truncate text-xs text-gray-500">{breadCrumb ? breadCrumb : ''}</p>
              <p className="mt-5 text-xs text-gray-700">
                {description ? description : ''}
              </p>
              <div className='flex justify-between mt-8'>
                <p className="truncate text-xs text-gray-500">{footerLeft ? footerLeft : ''}</p>
                <div className="grid place-items-end"><p className="truncate text-xs text-gray-500">{footerRight ? footerRight : ''}</p></div>
              </div>
              <div className='flex justify-between mt-8'>
                {footerLink ? 
                  <a target='_blank' className="truncate text-xs z-10 hover:underline" href={footerLink}>View details on semantics scholar</a>
                  :
                  ''
                } 
              </div>
            </a>
          </div>
        </div>
    </div>
  </>
}

export default InfoCardSmall