'use client'
import React from 'react'

interface ButtonPrimary{
  clickEvent:()=>void,
  children:React.ReactNode,
  disabled?:boolean | undefined
  className?:string
}

const ButtonPrimary = ({clickEvent=()=>{},children,disabled,className=''}:ButtonPrimary) => {
  return (
    <button
        type="button"
        className={`${className} ml-3 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${disabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : `bg-primary text-white hover:bg-grey-700`}`}
        disabled={disabled}
        onClick={clickEvent}
        >
        {children}
    </button>
  )
}

export default ButtonPrimary