'use client'
import React from 'react'

const ButtonPrimary = ({clickEvent=null,btnText=null,disabled=null}) => {
  return (
    <button
        type="button"
        className={`ml-3 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${disabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-indigo-700'}`}
        disabled={disabled}
        onClick={clickEvent}
        >
        {btnText}
    </button>
  )
}

export default ButtonPrimary