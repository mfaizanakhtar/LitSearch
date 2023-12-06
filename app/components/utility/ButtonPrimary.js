'use client'
import React from 'react'

const ButtonPrimary = ({clickEvent,btnText}) => {
  return (
    <button
        type="button"
        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={clickEvent}
        >
        {btnText}
    </button>
  )
}

export default ButtonPrimary