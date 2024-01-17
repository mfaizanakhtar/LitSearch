import { InformationCircleIcon,BookOpenIcon } from '@heroicons/react/24/outline'
import React from 'react'
import ButtonPrimary from './ButtonPrimary'

interface InfoCard{
    key:string,
    title:string,
    breadCrumb:string,
    description:string,
    footerLeft:string,
    footerRight:string
}

const InfoCardSmall = ({key,title,breadCrumb,description,footerLeft,footerRight}:InfoCard) => {
  return <>
    <div key={key} className="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-xm font-medium text-gray-900">{title ? title : ''}</p>
              <p className="truncate text-xs text-gray-500">{breadCrumb ? breadCrumb : ''}</p>
              <p className="mt-5 text-xs text-gray-700">
                {description ? description : ''}
              </p>
              <div className='flex justify-between mt-8'>
                <p className="truncate text-xs text-gray-500">{footerLeft ? footerLeft : ''}</p>
                <div className="grid place-items-end"><p className="truncate text-xs text-gray-500">{footerRight ? footerRight : ''}</p></div>
              </div>
            </a>
          </div>
        </div>
    </div>
  </>
}

export default InfoCardSmall