'use client'
import React from 'react'

const TextInput = ({name,id,placeholder,value=undefined,onChange=undefined,style=undefined,className=undefined,errorMsg=undefined}:any) => {
  return (
    <>
    <input
        style={style}
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event)=>{onChange(event?.target.value)}}
        className={`form-input ${errorMsg ? 'border border-red-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-0 ring-1 ring-inset ring-gray-300'} block w-full rounded-md py-1.5 pr-10 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 ${className}`}
        autoComplete='off'
    />
    {errorMsg ? <p className="text-red-600 text-xs italic mt-2">{errorMsg}</p> : <></>}
    </>
  )
}

export default TextInput