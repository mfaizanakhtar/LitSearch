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

const Badge = ({badgeText}:{badgeText:string}) => {

    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    return (
    <>
    <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
        <svg className={`h-1.5 w-1.5 ${randomColor}`} viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        {badgeText}
      </span>
    </>
  )
}

export default Badge