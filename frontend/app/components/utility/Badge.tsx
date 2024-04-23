import React from 'react'

// Define the color classes
const colorClasses = [
    'fill-red-500',
    'fill-yellow-500',
    'fill-blue-500',
    'fill-indigo-500',
    'fill-purple-500',
    'fill-pink-500'
  ];

const Badge = ({badgeText,isColour=true}:{badgeText:string,isColour?:boolean}) => {

    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    return (
    <>
    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ${isColour ? 'ring-gray-200' : 'ring-gray-400'}`}>
        <svg className={`h-1.5 w-1.5 ${isColour ? randomColor : '-ml-3'}`} viewBox="0 0 6 6" aria-hidden="true">
          {isColour ? <circle cx={3} cy={3} r={3} /> : ''}
        </svg>
        {badgeText}
      </span>
    </>
  )
}

export default Badge