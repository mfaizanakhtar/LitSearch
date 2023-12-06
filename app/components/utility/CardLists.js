import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const CardLists = ({list,titleKey,descKey}) => {
  return (
    <ul
    role="list"
    className="divide-y divide-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
    {list.map((result,index) => (
        <li key={index} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
        <div className="flex min-w-0 gap-x-4">
            {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
            <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href="#">
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {result[titleKey]}
                </a>
            </p>
            {/* <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a href="#" className="relative truncate hover:underline">
                {result.publicationDate?.substr(0,4)} - {result.journal.name}
                </a>
            </p> */}
                <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-gray-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-xs leading-5 text-gray-500">{result[descKey]}</p>
                </div>
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
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </div>
        </li>
    ))}
</ul>
  )
}

export default CardLists