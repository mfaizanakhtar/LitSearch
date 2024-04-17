import { AcademicCapIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface cardInput{
  title:string,
  details:string,
  footerLeft?:string,
  footerRight?:string
}

const InfoCardLarge = ({title,details,footerLeft,footerRight}:cardInput) => {
  return <>
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow fade-in">
        <div
          className='rounded-tl-lg rounded-tr-lg sm:rounded-tr-none 
          group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
        >
          <div >
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <a href='' className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {title}
              </a>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {details}
            </p>
            <div className='flex justify-between w-full'>
              <p className="mt-2 text-sm">
                {footerLeft}
              </p>
              <p className="mt-2 text-sm">
                {footerRight}
              </p>
            </div>
          </div>
        </div>
    </div>
  </>
}

export default InfoCardLarge