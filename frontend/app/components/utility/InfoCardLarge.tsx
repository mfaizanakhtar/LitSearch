import { AcademicCapIcon } from '@heroicons/react/24/outline'
import React from 'react'

const InfoCardLarge = () => {
  return <>
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow">
        <div
        //   key={action.title}
          className='rounded-tl-lg rounded-tr-lg sm:rounded-tr-none 
          group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
        >
          <div >
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <a href='' className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {'title'}
              </a>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et
              quo et molestiae.
            </p>
          </div>
        </div>
    </div>
  </>
}

export default InfoCardLarge