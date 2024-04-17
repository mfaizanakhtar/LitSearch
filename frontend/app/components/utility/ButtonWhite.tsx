'use client'
import React from 'react'

interface ButtonWhite{
  clickEvent:()=>void,
  children:React.ReactNode,
  className?:string
}

const ButtonWhite = ({clickEvent=()=>{},children,className=''}:ButtonWhite) => {
  return (
    <button
        type="button"
        className={`${className} ml-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 border-gray-400 border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
        onClick={clickEvent}
        >
        {children}
    </button>
  )
}

export default ButtonWhite